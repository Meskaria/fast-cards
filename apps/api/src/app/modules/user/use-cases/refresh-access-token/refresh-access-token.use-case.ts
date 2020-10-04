import { UseCase } from '../../../../shared/core/UseCase';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import { JWTToken, RefreshToken } from '../../domain/jwt';
import { RefreshAccessTokenErrors } from 'apps/api/src/app/modules/user/use-cases/refresh-access-token/refresh-access-token.errors';
import { User } from '../../domain/user';
import { RefreshAccessTokenDto } from 'apps/api/src/app/modules/user/use-cases/refresh-access-token/refresh-access-token.dto';
import { UserRepository } from 'apps/api/src/app/modules/user/repos/user.repository';
import { AuthService } from 'apps/api/src/app/modules/user/services/auth/auth.service';
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
    let username: string;

    try {
      // Get the username for the user that owns the refresh token
      try {
        username = await this.authService.getUserEmailFromRefreshToken(
          refreshToken
        );
      } catch (err) {
        return left(new RefreshAccessTokenErrors.RefreshTokenNotFound());
      }

      try {
        // get the user by username
        user = await this.userRepo.getUserByEmail(username);
      } catch (err) {
        return left(new RefreshAccessTokenErrors.UserNotFoundOrDeletedError());
      }

      const accessToken: JWTToken = this.authService.signJWT({
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        userId: user.userId.id.toString(),
      });

      // sign a new jwt for that user
      user.setAccessToken(accessToken, refreshToken);

      // save it
      await this.authService.saveAuthenticatedUser(user);

      // return the new access token
      return right(Result.ok<JWTToken>(accessToken));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
