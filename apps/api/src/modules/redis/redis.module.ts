import { Module } from '@nestjs/common';

import { redisProviders } from '@app/modules/redis/redis.providers';
import { RedisService } from '@app/modules/redis/redis.service';

@Module({
  providers: [...redisProviders, RedisService],
  exports: [...redisProviders, RedisService],
})
export class RedisModule {}
