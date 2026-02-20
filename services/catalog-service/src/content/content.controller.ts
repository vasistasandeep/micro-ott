import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('content')
  async listContent(
    @Query('type') type?: string,
    @Query('genre') genre?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.contentService.listContent({
      type,
      genre,
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0,
    });
  }

  @Get('content/:id')
  async getContent(@Param('id') id: string) {
    return this.contentService.getContentById(id);
  }

  @Get('search')
  async searchContent(@Query('q') query: string) {
    return this.contentService.searchContent(query);
  }

  @Get('genres')
  async listGenres() {
    return this.contentService.listGenres();
  }

  @Get('trending')
  async getTrending() {
    return this.contentService.getTrendingContent();
  }

  @Get('content/:id/seasons')
  async getSeasons(@Param('id') contentId: string) {
    return this.contentService.getSeasons(contentId);
  }

  @Get('seasons/:id/episodes')
  async getEpisodes(@Param('id') seasonId: string) {
    return this.contentService.getEpisodes(seasonId);
  }
}
