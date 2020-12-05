import { UseCase } from '@app/shared/core/UseCase';
import { Either, left, Result, right } from '@app/shared/core/Result';
import { LogoutDto } from '@app/modules/user/use-cases/logout/logout.dto';
import { AppError } from '@app/shared/core/AppError';
import { User } from '@app/modules/user/domain/model/user';
import { LogoutErrors } from '@app/modules/user/use-cases/logout/logout.errors';
import { UserRepository } from '@app/modules/user/repos/user.repository';
import { AuthService } from '@app/modules/user/services/auth/auth.service';
import { Injectable } from '@nestjs/common';

type Response = Either<AppError.UnexpectedError, Result<void>>;

@Injectable()
export class LogoutUseCase implements UseCase<LogoutDto, Promise<Response>> {
  constructor(
    private userRepo: UserRepository,
    private authService: AuthService
  ) {}

  public async execute(request: LogoutDto): Promise<Response> {
    let user: User;
    const { userId } = request;

    try {
      try {
        user = await this.userRepo.getUserByUserId(userId);
      } catch (err) {
        return left(new LogoutErrors.UserNotFoundOrDeletedError());
      }

      await this.authService.deAuthenticateUser(user.email.value);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
