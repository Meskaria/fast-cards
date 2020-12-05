import { UseCaseError } from '@app/shared/core/UseCaseError';
import { Result } from '@app/shared/core/Result';

export namespace GetUserByUserEmailErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `No user with the email ${email} was found`,
      } as UseCaseError);
    }
  }
}
