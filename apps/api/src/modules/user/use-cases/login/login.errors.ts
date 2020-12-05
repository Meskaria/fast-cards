import { UseCaseError } from '@app/shared/core/UseCaseError';
import { Result } from '@app/shared/core/Result';

export namespace LoginUseCaseErrors {
  export class UserEmailDoesntExistError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `User email or password incorrect.`,
      } as UseCaseError);
    }
  }

  export class PasswordDoesntMatchError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Password doesn't match error.`,
      } as UseCaseError);
    }
  }
  export class UserDeletedError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `User was deleted.`,
      } as UseCaseError);
    }
  }
}
