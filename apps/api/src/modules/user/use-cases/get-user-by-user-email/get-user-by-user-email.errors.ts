import { UseCaseError } from 'apps/api/src/shared/core/UseCaseError';
import { Result } from 'apps/api/src/shared/core/Result';

export namespace GetUserByUserEmailErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `No user with the email ${email} was found`,
      } as UseCaseError);
    }
  }
}
