import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger } from '@ott/shared';
import * as dotenv from 'dotenv';

dotenv.config();

const logger = createLogger('catalog-service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.enableCors();
  app.setGlobalPrefix('api/catalog');

  const port = process.env.CATALOG_SERVICE_PORT || 3002;
  await app.listen(port);

  logger.info(`Catalog Service running on port ${port}`);
}

bootstrap().catch((error) => {
  logger.error('Failed to start Catalog Service', error);
  process.exit(1);
});
