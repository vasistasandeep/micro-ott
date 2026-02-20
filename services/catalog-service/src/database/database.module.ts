import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

const databaseProvider = {
  provide: 'DATABASE_POOL',
  useFactory: () => {
    const config: any = {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'ott_catalog',
      user: process.env.POSTGRES_USER || 'ott_user',
      password: process.env.POSTGRES_PASSWORD || 'ott_password',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

    // Enable SSL for production (Neon requires SSL)
    if (process.env.POSTGRES_SSL === 'true' || process.env.NODE_ENV === 'production') {
      config.ssl = {
        rejectUnauthorized: false, // Required for Neon
      };
    }

    return new Pool(config);
  },
};

@Global()
@Module({
  providers: [databaseProvider],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {}
