import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { PlaybackService } from './playback.service';

@Controller()
export class PlaybackController {
  constructor(private readonly playbackService: PlaybackService) {}

  @Get(':contentId/manifest')
  async getManifest(@Param('contentId') contentId: string, @Query('quality') quality?: string) {
    return this.playbackService.getManifest(contentId, quality);
  }

  @Post('playback/start')
  async startPlayback(
    @Body()
    body: {
      userId: string;
      profileId: string;
      contentId: string;
      episodeId?: string;
    },
  ) {
    return this.playbackService.startPlayback(
      body.userId,
      body.profileId,
      body.contentId,
      body.episodeId,
    );
  }

  @Put('playback/position')
  async updatePosition(
    @Body()
    body: {
      userId: string;
      profileId: string;
      contentId: string;
      position: number;
      episodeId?: string;
    },
  ) {
    return this.playbackService.updatePosition(
      body.userId,
      body.profileId,
      body.contentId,
      body.position,
      body.episodeId,
    );
  }

  @Post('playback/complete')
  async completePlayback(
    @Body()
    body: {
      userId: string;
      profileId: string;
      contentId: string;
      episodeId?: string;
    },
  ) {
    return this.playbackService.completePlayback(
      body.userId,
      body.profileId,
      body.contentId,
      body.episodeId,
    );
  }

  @Get('continue-watching/:userId/:profileId')
  async getContinueWatching(@Param('userId') userId: string, @Param('profileId') profileId: string) {
    return this.playbackService.getContinueWatching(userId, profileId);
  }
}
