import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { createLogger } from '@ott/shared';

const logger = createLogger('catalog-service');

@Injectable()
export class ContentService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async listContent(filters: {
    type?: string;
    genre?: string;
    limit: number;
    offset: number;
  }) {
    let query = `
      SELECT c.*, 
        COALESCE(json_agg(DISTINCT g.*) FILTER (WHERE g.id IS NOT NULL), '[]') as genres
      FROM content c
      LEFT JOIN content_genres cg ON c.id = cg.content_id
      LEFT JOIN genres g ON cg.genre_id = g.id
      WHERE c.workflow_state = 'published'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (filters.type) {
      query += ` AND c.type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }

    query += ` GROUP BY c.id ORDER BY c.release_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(filters.limit, filters.offset);

    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async getContentById(id: string) {
    const query = `
      SELECT c.*, 
        COALESCE(json_agg(DISTINCT g.*) FILTER (WHERE g.id IS NOT NULL), '[]') as genres,
        COALESCE(json_agg(DISTINCT vv.*) FILTER (WHERE vv.id IS NOT NULL), '[]') as video_variants,
        COALESCE(json_agg(DISTINCT at.*) FILTER (WHERE at.id IS NOT NULL), '[]') as audio_tracks,
        COALESCE(json_agg(DISTINCT s.*) FILTER (WHERE s.id IS NOT NULL), '[]') as subtitles
      FROM content c
      LEFT JOIN content_genres cg ON c.id = cg.content_id
      LEFT JOIN genres g ON cg.genre_id = g.id
      LEFT JOIN video_variants vv ON c.id = vv.content_id
      LEFT JOIN audio_tracks at ON c.id = at.content_id
      LEFT JOIN subtitles s ON c.id = s.content_id
      WHERE c.id = $1 AND c.workflow_state = 'published'
      GROUP BY c.id
    `;

    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException('Content not found');
    }

    return result.rows[0];
  }

  async searchContent(searchQuery: string) {
    const query = `
      SELECT c.*, 
        COALESCE(json_agg(DISTINCT g.*) FILTER (WHERE g.id IS NOT NULL), '[]') as genres
      FROM content c
      LEFT JOIN content_genres cg ON c.id = cg.content_id
      LEFT JOIN genres g ON cg.genre_id = g.id
      WHERE c.workflow_state = 'published'
        AND (c.title ILIKE $1 OR c.description ILIKE $1)
      GROUP BY c.id
      ORDER BY c.release_date DESC
      LIMIT 20
    `;

    const result = await this.pool.query(query, [`%${searchQuery}%`]);
    return result.rows;
  }

  async listGenres() {
    const result = await this.pool.query('SELECT * FROM genres ORDER BY name');
    return result.rows;
  }

  async getTrendingContent() {
    // Simplified trending - in production, this would use view counts from user activity service
    const query = `
      SELECT c.*, 
        COALESCE(json_agg(DISTINCT g.*) FILTER (WHERE g.id IS NOT NULL), '[]') as genres
      FROM content c
      LEFT JOIN content_genres cg ON c.id = cg.content_id
      LEFT JOIN genres g ON cg.genre_id = g.id
      WHERE c.workflow_state = 'published'
        AND c.release_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY c.id
      ORDER BY c.release_date DESC
      LIMIT 10
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getSeasons(contentId: string) {
    const query = `
      SELECT * FROM seasons 
      WHERE content_id = $1 
      ORDER BY season_number
    `;

    const result = await this.pool.query(query, [contentId]);
    return result.rows;
  }

  async getEpisodes(seasonId: string) {
    const query = `
      SELECT e.*,
        COALESCE(json_agg(DISTINCT vv.*) FILTER (WHERE vv.id IS NOT NULL), '[]') as video_variants,
        COALESCE(json_agg(DISTINCT at.*) FILTER (WHERE at.id IS NOT NULL), '[]') as audio_tracks,
        COALESCE(json_agg(DISTINCT s.*) FILTER (WHERE s.id IS NOT NULL), '[]') as subtitles
      FROM episodes e
      LEFT JOIN video_variants vv ON e.id = vv.episode_id
      LEFT JOIN audio_tracks at ON e.id = at.episode_id
      LEFT JOIN subtitles s ON e.id = s.episode_id
      WHERE e.season_id = $1
      GROUP BY e.id
      ORDER BY e.episode_number
    `;

    const result = await this.pool.query(query, [seasonId]);
    return result.rows;
  }
}
