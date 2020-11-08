import { CreateUserUseCase } from 'apps/api/src/modules/user/use-cases/create-user/create-user.use-case';
import { DeleteUserUseCase } from 'apps/api/src/modules/user/use-cases/delete-user/delete-user.use-case';
import { GetUserByUserEmailUseCase } from 'apps/api/src/modules/user/use-cases/get-user-by-user-email/get-user-by-user-email.use-case';
import { LoginUserUseCase } from 'apps/api/src/modules/user/use-cases/login/login.use-case';
import { LogoutUseCase } from 'apps/api/src/modules/user/use-cases/logout/logout.use-case';
import { RefreshAccessTokenUseCase } from 'apps/api/src/modules/user/use-cases/refresh-access-token/refresh-access-token.use-case';

export default [
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByUserEmailUseCase,
  LoginUserUseCase,
  LogoutUseCase,
  RefreshAccessTokenUseCase,
];
