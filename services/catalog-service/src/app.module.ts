import { Module } from '@nestjs/common';
import { ContentModule } from './content/content.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, ContentModule],
})
export class AppModule {}
