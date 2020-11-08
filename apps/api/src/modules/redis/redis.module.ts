import { Module } from '@nestjs/common';

import { redisProviders } from 'apps/api/src/modules/redis/redis.providers';
import { RedisService } from 'apps/api/src/modules/redis/redis.service';

@Module({
  providers: [...redisProviders, RedisService],
  exports: [...redisProviders, RedisService],
})
export class RedisModule {}
