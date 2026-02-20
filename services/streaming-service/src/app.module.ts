import { Module } from '@nestjs/common';
import { PlaybackModule } from './playback/playback.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [RedisModule, PlaybackModule],
})
export class AppModule {}
