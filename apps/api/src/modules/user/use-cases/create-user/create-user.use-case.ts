import { Injectable } from '@nestjs/common';
import { UseCase } from 'apps/api/src/shared/core/UseCase';
import { CreateUserDto } from 'apps/api/src/modules/user/dtos/create-user.dto';
import { Either, left, Result, right } from 'apps/api/src/shared/core/Result';
import { UserEmail } from 'apps/api/src/modules/user/domain/model/user-email';
import { AppError } from 'apps/api/src/shared/core/AppError';
import { UserName } from 'apps/api/src/modules/user/domain/model/user-name';
import { User } from 'apps/api/src/modules/user/domain/model/user';
import { UserPassword } from 'apps/api/src/modules/user/domain/model/user-password';
import { UserSurname } from 'apps/api/src/modules/user/domain/model/user-surname';
import { CreateUserErrors } from 'apps/api/src/modules/user/use-cases/create-user/create-user.errors';
import { UserRepository } from 'apps/api/src/modules/user/repos/user.repository';
import { UniqueEntityID } from 'apps/api/src/shared/domain/UniqueEntityID';
import { EventPublisher } from '@nestjs/cqrs';

export type Response = Either<
  CreateUserErrors.EmailAlreadyExistsError | AppError.UnexpectedError,
  Result<User>
>;

@Injectable()
export class CreateUserUseCase
  implements UseCase<CreateUserDto, Promise<Response>> {
  constructor(
    private userRepo: UserRepository,
    private publisher: EventPublisher
  ) {}

  async execute(request?: CreateUserDto): Promise<Response> {
    console.count('CREATE USER USE CASE');

    const emailOrError = UserEmail.create(request.email);
    const passwordOrError = UserPassword.create({ value: request.password });
    const nameOrError = UserName.create({ name: request.name });
    const surnameOrError = UserSurname.create({ surname: request.surname });

    const dtoResult = Result.combine([
      emailOrError,
      passwordOrError,
      nameOrError,
      surnameOrError,
    ]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.error)) as Response;
    }

    const email: UserEmail = emailOrError.getValue();
    const password: UserPassword = passwordOrError.getValue();
    const name: UserName = nameOrError.getValue();
    const surname: UserSurname = surnameOrError.getValue();

    try {
      const userAlreadyExists = await this.userRepo.exists(email);

      if (userAlreadyExists) {
        return left(
          new CreateUserErrors.EmailAlreadyExistsError(email.value)
        ) as Response;
      }

      const nextUserId = this.userRepo.nextId();
      const userOrError: Result<User> = User.create(
        {
          email,
          password,
          name,
          surname,
          access: request.access,
        },
        new UniqueEntityID(nextUserId)
      );

      if (userOrError.isFailure) {
        return left(
          Result.fail<User>(userOrError.error.toString())
        ) as Response;
      }

      const user: User = userOrError.getValue();
      await this.userRepo.save(user);

      const savedUser = this.publisher.mergeObjectContext(user);

      savedUser.commit();

      return right(Result.ok<User>(savedUser));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
