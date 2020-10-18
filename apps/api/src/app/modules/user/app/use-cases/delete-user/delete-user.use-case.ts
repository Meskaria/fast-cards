import { Injectable } from '@nestjs/common';
import { UseCase } from 'apps/api/src/app/shared/core/UseCase';
import { DeleteUserDto } from 'apps/api/src/app/modules/user/infra/http/dtos/delete-user.dto';
import {
  Either,
  left,
  Result,
  right,
} from 'apps/api/src/app/shared/core/Result';
import { AppError } from 'apps/api/src/app/shared/core/AppError';
import { DeleteUserErrors } from 'apps/api/src/app/modules/user/app/use-cases/delete-user/delete-user.errors';
import { UserRepository } from 'apps/api/src/app/modules/user/infra/repos/user.repository';
import { AuthService } from 'apps/api/src/app/modules/user/infra/services/auth/auth.service';
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
