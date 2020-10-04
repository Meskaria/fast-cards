import {
  LoginDto,
  LoginDTOResponse,
} from 'apps/api/src/app/modules/user/use-cases/login/login.dto';
import { LoginUseCaseErrors } from 'apps/api/src/app/modules/user/use-cases/login/login.errors';
import { AppError } from '../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { UseCase } from '../../../../shared/core/UseCase';
import { User } from '../../domain/user';
import { UserPassword } from '../../domain/user-password';
import { JWTToken, RefreshToken } from '../../domain/jwt';
import { Injectable } from '@nestjs/common';
import { UserEmail } from 'apps/api/src/app/modules/user/domain/user-email';
import { AuthService } from 'apps/api/src/app/modules/user/services/auth/auth.service';
import { UserRepository } from 'apps/api/src/app/modules/user/repos/user.repository';

type Response = Either<
  | LoginUseCaseErrors.PasswordDoesntMatchError
  | LoginUseCaseErrors.UserNameDoesntExistError
  | AppError.UnexpectedError,
  Result<LoginDTOResponse>
>;

@Injectable()
export class LoginUserUseCase implements UseCase<LoginDto, Promise<Response>> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService
  ) {}

  public async execute(request: LoginDto): Promise<Response> {
    let user: User;
    let email: UserEmail;
    let password: UserPassword;

    try {
      const emailOrError = UserEmail.create(request.email);
      const passwordOrError = UserPassword.create({ value: request.password });
      const payloadResult = Result.combine([emailOrError, passwordOrError]);

      if (payloadResult.isFailure) {
        return left(Result.fail<any>(payloadResult.error));
      }

      email = emailOrError.getValue();
      password = passwordOrError.getValue();

      user = await this.userRepository.getUserByEmail(email);
      const userFound = !!user;

      if (!userFound) {
        return left(new LoginUseCaseErrors.UserNameDoesntExistError());
      }

      const passwordValid = await user.password.comparePassword(password.value);

      if (!passwordValid) {
        return left(new LoginUseCaseErrors.PasswordDoesntMatchError());
      }

      const accessToken: JWTToken = this.authService.signJWT({
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        userId: user.userId.id.toString(),
      });

      const refreshToken: RefreshToken = this.authService.createRefreshToken();

      user.setAccessToken(accessToken, refreshToken);

      await this.authService.saveAuthenticatedUser(user);

      return right(
        Result.ok<LoginDTOResponse>({
          accessToken,
          refreshToken,
        })
      );
    } catch (err) {
      return left(new AppError.UnexpectedError(err.toString()));
    }
  }
}
