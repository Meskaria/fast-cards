import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'apps/api/src/shared/infra/database/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
