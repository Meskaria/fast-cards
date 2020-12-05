import {
  LoginDto,
  LoginDTOResponse,
} from '@app/modules/user/dtos/login.dto';
import { LoginUseCaseErrors } from '@app/modules/user/use-cases/login/login.errors';
import { AppError } from '@app/shared/core/AppError';
import { Either, Result, left, right } from '@app/shared/core/Result';
import { UseCase } from '@app/shared/core/UseCase';
import { User } from '@app/modules/user/domain/model/user';
import { UserPassword } from '@app/modules/user/domain/model/user-password';
import { JWTToken, RefreshToken } from '@app/modules/user/domain/jwt';
import { Injectable } from '@nestjs/common';
import { UserEmail } from '@app/modules/user/domain/model/user-email';
import { AuthService } from '@app/modules/user/services/auth/auth.service';
import { UserRepository } from '@app/modules/user/repos/user.repository';

type Response = Either<
  | LoginUseCaseErrors.PasswordDoesntMatchError
  | LoginUseCaseErrors.UserEmailDoesntExistError
  | LoginUseCaseErrors.UserDeletedError
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
        return left(new LoginUseCaseErrors.UserEmailDoesntExistError());
      }

      if (user.isDeleted) {
        return left(new LoginUseCaseErrors.UserDeletedError());
      }

      const passwordValid = await user.password.comparePassword(password.value);

      if (!passwordValid) {
        return left(new LoginUseCaseErrors.PasswordDoesntMatchError());
      }

      const accessToken: JWTToken = this.authService.signJWT({
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        userId: user.id.value.toString(),
      });

      const refreshToken: RefreshToken = this.authService.createRefreshToken();

      user.setAccessToken(accessToken, refreshToken);

      await this.authService.saveAuthenticatedUser(user);
      await this.userRepository.save(user);

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
