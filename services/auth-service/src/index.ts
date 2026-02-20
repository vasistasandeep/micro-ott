import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger } from '@ott/shared';
import * as dotenv from 'dotenv';

dotenv.config();

const logger = createLogger('auth-service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api/auth');

  const port = process.env.AUTH_SERVICE_PORT || 3001;
  await app.listen(port);

  logger.info(`Auth Service running on port ${port}`);
}

bootstrap().catch((error) => {
  logger.error('Failed to start Auth Service', error);
  process.exit(1);
});
