import { Injectable, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { createLogger } from '@ott/shared';

const logger = createLogger('streaming-service');

@Injectable()
export class PlaybackService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: RedisClientType) {}

  async getManifest(contentId: string, quality?: string) {
    // In production, this would generate/fetch actual HLS/DASH manifests
    // For now, return a simple manifest structure
    return {
      contentId,
      type: 'hls',
      qualities: ['144p', '360p', '480p', '720p', '1080p'],
      defaultQuality: quality || '720p',
      manifestUrl: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`,
    };
  }

  async startPlayback(userId: string, profileId: string, contentId: string, episodeId?: string) {
    const sessionId = `${userId}:${profileId}:${contentId}${episodeId ? ':' + episodeId : ''}`;

    // Store playback session in Redis
    await this.redis.hSet(`playback:${sessionId}`, {
      userId,
      profileId,
      contentId,
      episodeId: episodeId || '',
      startedAt: new Date().toISOString(),
      position: '0',
    });

    // Set expiry for 24 hours
    await this.redis.expire(`playback:${sessionId}`, 86400);

    logger.info(`Started playback session: ${sessionId}`);

    return { sessionId, message: 'Playback session started' };
  }

  async updatePosition(
    userId: string,
    profileId: string,
    contentId: string,
    position: number,
    episodeId?: string,
  ) {
    const sessionId = `${userId}:${profileId}:${contentId}${episodeId ? ':' + episodeId : ''}`;

    await this.redis.hSet(`playback:${sessionId}`, {
      position: position.toString(),
      lastUpdated: new Date().toISOString(),
    });

    // Also update in a sorted set for "continue watching" feature
    const continueWatchingKey = `continue-watching:${userId}:${profileId}`;
    await this.redis.zAdd(continueWatchingKey, {
      score: Date.now(),
      value: JSON.stringify({ contentId, episodeId, position }),
    });

    return { message: 'Position updated' };
  }

  async completePlayback(
    userId: string,
    profileId: string,
    contentId: string,
    episodeId?: string,
  ) {
    const sessionId = `${userId}:${profileId}:${contentId}${episodeId ? ':' + episodeId : ''}`;

    // Mark as completed
    await this.redis.hSet(`playback:${sessionId}`, {
      completed: 'true',
      completedAt: new Date().toISOString(),
    });

    // Remove from continue watching
    const continueWatchingKey = `continue-watching:${userId}:${profileId}`;
    const members = await this.redis.zRange(continueWatchingKey, 0, -1);

    for (const member of members) {
      const data = JSON.parse(member);
      if (data.contentId === contentId && data.episodeId === episodeId) {
        await this.redis.zRem(continueWatchingKey, member);
      }
    }

    logger.info(`Completed playback session: ${sessionId}`);

    return { message: 'Playback completed' };
  }

  async getContinueWatching(userId: string, profileId: string) {
    const continueWatchingKey = `continue-watching:${userId}:${profileId}`;

    // Get last 10 items
    const items = await this.redis.zRange(continueWatchingKey, 0, 9, { REV: true });

    return items.map((item) => JSON.parse(item));
  }
}
