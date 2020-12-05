import { Injectable } from '@nestjs/common';
import { UseCase } from '@app/shared/core/UseCase';
import { DeleteUserDto } from '@app/modules/user/use-cases/delete-user/delete-user.dto';
import { Either, left, Result, right } from '@app/shared/core/Result';
import { AppError } from '@app/shared/core/AppError';
import { DeleteUserErrors } from '@app/modules/user/use-cases/delete-user/delete-user.errors';
import { UserRepository } from '@app/modules/user/repos/user.repository';
import { AuthService } from '@app/modules/user/services/auth/auth.service';
import { EventPublisher } from '@nestjs/cqrs';

export type Response = Either<
  DeleteUserErrors.UserNotFoundError | AppError.UnexpectedError,
  Result<void>
>;

@Injectable()
export class DeleteUserUseCase
  implements UseCase<DeleteUserDto, Promise<Response>> {
  constructor(
    private userRepo: UserRepository,
    private authService: AuthService,
    private publisher: EventPublisher
  ) {}

  async execute(request: DeleteUserDto): Promise<Response> {
    try {
      const user = await this.userRepo.getUserByUserId(request.userId);
      const userFound = !!user === true;

      if (!userFound) {
        return left(new DeleteUserErrors.UserNotFoundError(request.userId));
      }

      user.delete();
      await this.authService.clearAllSessions(user.email.value);

      await this.userRepo.save(user);

      this.publisher.mergeObjectContext(user).commit();

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
