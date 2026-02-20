import { Module, Global } from '@nestjs/common';
import { createClient } from 'redis';

const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    await client.connect();
    return client;
  },
};

@Global()
@Module({
  providers: [redisProvider],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
