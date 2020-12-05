import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';

import {
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from '@app/modules/redis/redis.constants';

export const redisProviders: Provider[] = [
  {
    useFactory: (configService: ConfigService): Redis =>
      new IORedis({
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
      }),
    provide: REDIS_SUBSCRIBER_CLIENT,
    inject: [ConfigService],
  },
  {
    useFactory: (configService: ConfigService): Redis =>
      new IORedis({
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
      }),
    provide: REDIS_PUBLISHER_CLIENT,
    inject: [ConfigService],
  },
];
