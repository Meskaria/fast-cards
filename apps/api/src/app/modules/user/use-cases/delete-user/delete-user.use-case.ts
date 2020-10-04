import { Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/core/UseCase';
import { DeleteUserDto } from './delete-user.dto';
import { Either, left, Result, right } from '../../../../shared/core/Result';
import { AppError } from '../../../../shared/core/AppError';
import { DeleteUserErrors } from './delete-user.errors';
import { UserRepository } from '../../repos/user.repository';

export type Response = Either<
  DeleteUserErrors.UserNotFoundError | AppError.UnexpectedError,
  Result<void>
>;

@Injectable()
export class DeleteUserUseCase
  implements UseCase<DeleteUserDto, Promise<Response>> {
  constructor(private userRepo: UserRepository) {}

  async execute(request: DeleteUserDto): Promise<Response> {
    try {
      const user = await this.userRepo.getUserByUserId(request.userId);
      const userFound = !!user === true;

      if (!userFound) {
        return left(new DeleteUserErrors.UserNotFoundError(request.userId));
      }

      user.delete();

      await this.userRepo.save(user);

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
