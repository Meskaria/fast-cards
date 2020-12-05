import { GetUserByUserEmailDto } from '@app/modules/user/use-cases/get-user-by-user-email/get-user-by-user-email.dto';
import { GetUserByUserEmailErrors } from '@app/modules/user/use-cases/get-user-by-user-email/get-user-by-user-email.errors';
import { left, Result, Either, right } from '@app/shared/core/Result';
import { UseCase } from '@app/shared/core/UseCase';
import { AppError } from '@app/shared/core/AppError';
import { User } from '@app/modules/user/domain/model/user';
import { UserRepository } from '@app/modules/user/repos/user.repository';
import { UserEmail } from '@app/modules/user/domain/model/user-email';
import { Injectable } from '@nestjs/common';

type Response = Either<
  AppError.UnexpectedError | GetUserByUserEmailErrors.UserNotFoundError,
  Result<User>
>;

@Injectable()
export class GetUserByUserEmailUseCase
  implements UseCase<GetUserByUserEmailDto, Promise<Response>> {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(request: GetUserByUserEmailDto): Promise<Response> {
    try {
      const userEmailOrError = UserEmail.create(request.email);

      if (userEmailOrError.isFailure) {
        return left(
          Result.fail<any>(userEmailOrError.errorValue().toString())
        ) as Response;
      }

      const userEmail: UserEmail = userEmailOrError.getValue();
      const user = await this.userRepository.getUserByEmail(userEmail);
      const userFound = !!user;

      if (!userFound) {
        return left(
          new GetUserByUserEmailErrors.UserNotFoundError(userEmail.value)
        ) as Response;
      }

      return right(Result.ok<User>(user));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
