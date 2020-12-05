import { Module, ValidationPipe } from '@nestjs/common';

import { UserModule } from './modules/user/user.module';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from './shared/infra/database/prisma.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@app/modules/redis/redis.module';
import { TeachingModule } from './modules/teaching/teaching.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    TerminusModule,
    PrismaModule,
    TeachingModule,
    RedisModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
    },
  ],
})
export class AppModule {}
