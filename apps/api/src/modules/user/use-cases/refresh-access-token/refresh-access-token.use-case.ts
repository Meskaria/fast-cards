import { UseCase } from '@app/shared/core/UseCase';
import { Either, Result, left, right } from '@app/shared/core/Result';
import { AppError } from '@app/shared/core/AppError';
import { JWTToken } from '@app/modules/user/domain/jwt';
import { RefreshAccessTokenErrors } from '@app/modules/user/use-cases/refresh-access-token/refresh-access-token.errors';
import { User } from '@app/modules/user/domain/model/user';
import { RefreshAccessTokenDto } from '@app/modules/user/use-cases/refresh-access-token/refresh-access-token.dto';
import { UserRepository } from '@app/modules/user/repos/user.repository';
import { AuthService } from '@app/modules/user/services/auth/auth.service';
import { Injectable } from '@nestjs/common';

type Response = Either<
  RefreshAccessTokenErrors.RefreshTokenNotFound | AppError.UnexpectedError,
  Result<JWTToken>
>;

@Injectable()
export class RefreshAccessTokenUseCase
  implements UseCase<RefreshAccessTokenDto, Promise<Response>> {
  constructor(
    private userRepo: UserRepository,
    private authService: AuthService
  ) {}

  public async execute(req: RefreshAccessTokenDto): Promise<Response> {
    const { refreshToken } = req;
    let user: User;
    let email: string;

    try {
      try {
        email = await this.authService.getUserEmailFromRefreshToken(
          refreshToken
        );
      } catch (err) {
        return left(new RefreshAccessTokenErrors.RefreshTokenNotFound());
      }

      try {
        user = await this.userRepo.getUserByEmail(email);
      } catch (err) {
        return left(new RefreshAccessTokenErrors.UserNotFoundOrDeletedError());
      }

      const accessToken: JWTToken = this.authService.signJWT({
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        userId: user.id.toString(),
      });

      user.setAccessToken(accessToken, refreshToken);

      await this.authService.saveAuthenticatedUser(user);
      await this.userRepo.save(user);

      return right(Result.ok<JWTToken>(accessToken));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
