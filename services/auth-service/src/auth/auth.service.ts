import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { createLogger } from '@ott/shared';
import { JwtPayload, SubscriptionTier } from '@ott/types';

const logger = createLogger('auth-service');

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE_POOL') private readonly pool: Pool,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    // Check if user exists
    const existingUser = await this.pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const result = await this.pool.query(
      'INSERT INTO users (email, password_hash, subscription_tier) VALUES ($1, $2, $3) RETURNING id, email, subscription_tier, created_at',
      [email, passwordHash, 'free'],
    );

    const user = result.rows[0];

    // Create default profile
    await this.pool.query(
      'INSERT INTO profiles (user_id, name, language_preference) VALUES ($1, $2, $3)',
      [user.id, 'Default', 'en'],
    );

    logger.info(`User registered: ${email}`);

    return {
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscription_tier,
    };
  }

  async login(email: string, password: string) {
    // Get user
    const result = await this.pool.query(
      'SELECT id, email, password_hash, subscription_tier FROM users WHERE email = $1',
      [email],
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      subscriptionTier: user.subscription_tier,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    logger.info(`User logged in: ${email}`);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        subscriptionTier: user.subscription_tier,
      },
    };
  }

  async getProfiles(userId: string) {
    const result = await this.pool.query(
      'SELECT id, name, avatar_url, maturity_rating, language_preference FROM profiles WHERE user_id = $1',
      [userId],
    );

    return result.rows;
  }

  async createProfile(userId: string, name: string, languagePreference: string = 'en') {
    // Check profile limit (max 5)
    const countResult = await this.pool.query('SELECT COUNT(*) FROM profiles WHERE user_id = $1', [
      userId,
    ]);

    if (parseInt(countResult.rows[0].count) >= 5) {
      throw new ConflictException('Maximum 5 profiles allowed per account');
    }

    const result = await this.pool.query(
      'INSERT INTO profiles (user_id, name, language_preference) VALUES ($1, $2, $3) RETURNING id, name, avatar_url, maturity_rating, language_preference',
      [userId, name, languagePreference],
    );

    return result.rows[0];
  }

  async updateProfile(profileId: string, updates: { name?: string; avatarUrl?: string; maturityRating?: string; languagePreference?: string }) {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.name) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.avatarUrl) {
      fields.push(`avatar_url = $${paramIndex++}`);
      values.push(updates.avatarUrl);
    }
    if (updates.maturityRating) {
      fields.push(`maturity_rating = $${paramIndex++}`);
      values.push(updates.maturityRating);
    }
    if (updates.languagePreference) {
      fields.push(`language_preference = $${paramIndex++}`);
      values.push(updates.languagePreference);
    }

    if (fields.length === 0) {
      return;
    }

    values.push(profileId);

    const query = `UPDATE profiles SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await this.pool.query(query, values);

    return result.rows[0];
  }

  async deleteProfile(profileId: string) {
    await this.pool.query('DELETE FROM profiles WHERE id = $1', [profileId]);
    return { message: 'Profile deleted' };
  }
}
