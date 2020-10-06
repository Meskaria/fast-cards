import { Module } from '@nestjs/common';
import { UserController } from 'apps/api/src/app/modules/user/infra/http/user.controller';
import { UserMap } from './infra/mappers/user.map';
import { UserRepository } from './infra/repos/user.repository';
import { CreateUserUseCase } from './app/use-cases/create-user/create-user.use-case';
import { RedisModule } from 'apps/api/src/app/modules/redis/redis.module';
import { AuthService } from 'apps/api/src/app/modules/user/infra/services/auth/auth.service';
import { DeleteUserUseCase } from 'apps/api/src/app/modules/user/app/use-cases/delete-user/delete-user.use-case';
import { LoginUserUseCase } from 'apps/api/src/app/modules/user/app/use-cases/login/login.use-case';
import { LogoutUseCase } from 'apps/api/src/app/modules/user/app/use-cases/logout/logout.use-case';
import { RefreshAccessTokenUseCase } from 'apps/api/src/app/modules/user/app/use-cases/refresh-access-token/refresh-access-token.use-case';
import { JwtStrategy } from 'apps/api/src/app/modules/user/infra/services/auth/strategies/jwt.strategy';
import { GetUserByUserEmailUseCase } from 'apps/api/src/app/modules/user/app/use-cases/get-user-by-user-email/get-user-by-user-email.use-case';
import { UserCreatedEventHandler } from 'apps/api/src/app/modules/user/app/events/handlers/user-created.event.handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  controllers: [UserController],
  providers: [
    UserMap,
    UserRepository,
    JwtStrategy,
    GetUserByUserEmailUseCase,
    RefreshAccessTokenUseCase,
    LogoutUseCase,
    LoginUserUseCase,
    DeleteUserUseCase,
    CreateUserUseCase,
    AuthService,
    UserCreatedEventHandler,
  ],
  imports: [RedisModule, CqrsModule],
})
export class UserModule {}
