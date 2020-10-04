import { GetUserByUserEmailDto } from 'apps/api/src/app/modules/user/use-cases/get-user-by-user-email/get-user-by-user-email.dto';
import { GetUserByUserNameErrors } from 'apps/api/src/app/modules/user/use-cases/get-user-by-user-email/get-user-by-user-email.errors';
import { left, Result, Either, right } from '../../../../shared/core/Result';
import { UseCase } from '../../../../shared/core/UseCase';
import { AppError } from '../../../../shared/core/AppError';
import { User } from '../../domain/user';
import { UserRepository } from 'apps/api/src/app/modules/user/repos/user.repository';
import { UserEmail } from 'apps/api/src/app/modules/user/domain/user-email';
import { Injectable } from '@nestjs/common';

type Response = Either<AppError.UnexpectedError, Result<User>>;

@Injectable()
export class GetUserByUserEmailUseCase
  implements UseCase<GetUserByUserEmailDto, Promise<Response>> {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(request: GetUserByUserEmailDto): Promise<Response> {
    try {
      const userEmailOrError = UserEmail.create(request.email);

      if (userEmailOrError.isFailure) {
        return left(
          Result.fail<any>(userEmailOrError.error.toString())
        ) as Response;
      }

      const userEmail: UserEmail = userEmailOrError.getValue();
      console.log(this.userRepository, 'this.userRepo');

      const user = await this.userRepository.getUserByEmail(userEmail);
      const userFound = !!user === true;

      if (!userFound) {
        return left(
          new GetUserByUserNameErrors.UserNotFoundError(userEmail.value)
        ) as Response;
      }

      return right(Result.ok<User>(user));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
