import { Module, ValidationPipe } from '@nestjs/common';

import { UserModule } from './modules/user/user.module';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from './shared/infra/database/prisma.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from 'apps/api/src/app/modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    TerminusModule,
    PrismaModule,
    RedisModule
  ],
  controllers: [],
  providers: [{
    provide: APP_PIPE,
    useFactory: () =>
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
  }],
})
export class AppModule {
}
