import { UseCaseError } from 'apps/api/src/shared/core/UseCaseError';
import { Result } from 'apps/api/src/shared/core/Result';

export namespace CreateStudentErrors {
  export class StudentAlreadyExistsError extends Result<UseCaseError> {
    constructor(userId: string) {
      super(false, {
        message: `The student with userId: ${userId}, already exists in the db`,
      } as UseCaseError);
    }
  }
}
