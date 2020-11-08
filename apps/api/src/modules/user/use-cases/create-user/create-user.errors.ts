import { UseCaseError } from 'apps/api/src/shared/core/UseCaseError';
import { Result } from 'apps/api/src/shared/core/Result';

export namespace CreateUserErrors {
  export class EmailAlreadyExistsError extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `The email ${email} associated for this account already exists`,
      } as UseCaseError);
    }
  }
}
