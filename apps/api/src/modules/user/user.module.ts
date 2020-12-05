import { Module } from '@nestjs/common';
import { UserController } from '@app/modules/user/controllers/user.controller';
import { UserMap } from '@app/modules/user/mappers/user.map';
import { UserRepository } from '@app/modules/user/repos/user.repository';
import { RedisModule } from '@app/modules/redis/redis.module';
import { AuthService } from '@app/modules/user/services/auth/auth.service';
import { JwtStrategy } from '@app/modules/user/services/auth/strategies/jwt.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import UseCases from '@app/modules/user/use-cases';

@Module({
  controllers: [UserController],
  providers: [UserMap, UserRepository, JwtStrategy, AuthService, ...UseCases],
  imports: [RedisModule, CqrsModule],
})
export class UserModule {}
