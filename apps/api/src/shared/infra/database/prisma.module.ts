import { Global, Module } from '@nestjs/common';
import { PrismaService } from '@app/shared/infra/database/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
