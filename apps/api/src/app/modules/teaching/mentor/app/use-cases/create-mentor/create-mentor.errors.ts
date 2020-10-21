import { UseCaseError } from 'apps/api/src/app/shared/core/UseCaseError';
import { Result } from 'apps/api/src/app/shared/core/Result';

export namespace CreateMentorErrors {
  export class MentorAlreadyExistsError extends Result<UseCaseError> {
    constructor(userId: string) {
      super(false, {
        message: `The mentor with userId: ${userId}, already exists in the db`,
      } as UseCaseError);
    }
  }
}
