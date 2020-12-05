import { UseCaseError } from '@app/shared/core/UseCaseError';
import { Result } from '@app/shared/core/Result';

export namespace LogoutErrors {
  export class UserNotFoundOrDeletedError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `User not found or doesn't exist anymore.`,
      } as UseCaseError);
    }
  }
}
