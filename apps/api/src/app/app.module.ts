import { Module, ValidationPipe } from '@nestjs/common';

import { UserModule } from './modules/user/user.module';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from './shared/infra/database/prisma.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [UserModule, TerminusModule, PrismaModule],
  controllers: [],
  providers:[{
    provide: APP_PIPE,
    useFactory: () =>
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
  },]
})
export class AppModule {}
