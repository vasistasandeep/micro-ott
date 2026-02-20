import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger } from '@ott/shared';
import * as dotenv from 'dotenv';

dotenv.config();

const logger = createLogger('streaming-service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api/stream');

  const port = process.env.STREAMING_SERVICE_PORT || 3003;
  await app.listen(port);

  logger.info(`Streaming Service running on port ${port}`);
}

bootstrap().catch((error) => {
  logger.error('Failed to start Streaming Service', error);
  process.exit(1);
});
