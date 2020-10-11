import { UseCaseError } from 'apps/api/src/app/shared/core/UseCaseError';
import { Result } from 'apps/api/src/app/shared/core/Result';

export namespace DeleteUserErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor(userId: string) {
      super(false, {
        message: `User with ${userId} was not found`,
      } as UseCaseError);
    }
  }
}
