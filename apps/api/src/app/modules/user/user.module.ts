import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserMap } from './mappers/user.map';
import { UserRepository } from './repos/user.repository';
import { CreateUserUseCase } from './use-cases/create-user/create-user.use-case';
import { RedisModule } from 'apps/api/src/app/modules/redis/redis.module';
import { AuthService } from 'apps/api/src/app/modules/user/services/auth/auth.service';
import { DeleteUserUseCase } from 'apps/api/src/app/modules/user/use-cases/delete-user/delete-user.use-case';
import { LoginUserUseCase } from 'apps/api/src/app/modules/user/use-cases/login/login.use-case';
import { LogoutUseCase } from 'apps/api/src/app/modules/user/use-cases/logout/logout.use-case';
import { RefreshAccessTokenUseCase } from 'apps/api/src/app/modules/user/use-cases/refresh-access-token/refresh-access-token.use-case';
import { JwtStrategy } from 'apps/api/src/app/modules/user/services/auth/strategies/jwt.strategy';
import { GetUserByUserEmailUseCase } from 'apps/api/src/app/modules/user/use-cases/get-user-by-user-email/get-user-by-user-email.use-case';

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
  ],
  imports: [RedisModule],
})
export class UserModule {}
