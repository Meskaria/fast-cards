import { Module } from '@nestjs/common';
import { UserController } from 'apps/api/src/modules/user/controllers/user.controller';
import { UserMap } from 'apps/api/src/modules/user/mappers/user.map';
import { UserRepository } from 'apps/api/src/modules/user/repos/user.repository';
import { RedisModule } from 'apps/api/src/modules/redis/redis.module';
import { AuthService } from 'apps/api/src/modules/user/services/auth/auth.service';
import { JwtStrategy } from 'apps/api/src/modules/user/services/auth/strategies/jwt.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import UseCases from 'apps/api/src/modules/user/use-cases';

@Module({
  controllers: [UserController],
  providers: [UserMap, UserRepository, JwtStrategy, AuthService, ...UseCases],
  imports: [RedisModule, CqrsModule],
})
export class UserModule {}
