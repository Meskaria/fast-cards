import { Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/core/UseCase';
import { CreateUserDto } from './create-user.dto';
import { Either, left, Result, right } from '../../../../shared/core/Result';
import { UserEmail } from '../../domain/user-email';
import { AppError } from '../../../../shared/core/AppError';
import { UserName } from '../../domain/user-name';
import { User } from '../../domain/user';
import { UserPassword } from '../../domain/user-password';
import { UserSurname } from '../../domain/user-surname';
import { CreateUserErrors } from './create-user.errors';
import { UserRepository } from '../../repos/user.repository';

export type Response = Either<
  CreateUserErrors.EmailAlreadyExistsError | AppError.UnexpectedError,
  Result<User>
>;

@Injectable()
export class CreateUserUseCase
  implements UseCase<CreateUserDto, Promise<Response>> {
  constructor(private userRepo: UserRepository) {}

  async execute(request?: CreateUserDto): Promise<Response> {
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

      const userOrError: Result<User> = User.create({
        email,
        password,
        name,
        surname,
        access: request.access,
      });

      if (userOrError.isFailure) {
        return left(
          Result.fail<User>(userOrError.error.toString())
        ) as Response;
      }

      const user: User = userOrError.getValue();

      const result = await this.userRepo.save(user);
      return right(Result.ok<User>(result));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
