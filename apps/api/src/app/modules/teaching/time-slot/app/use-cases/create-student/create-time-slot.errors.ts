import { UseCaseError } from 'apps/api/src/app/shared/core/UseCaseError';
import { Result } from 'apps/api/src/app/shared/core/Result';

export namespace CreateTimeSlotErrors {
  export class TimeSlotAlreadyExistsError extends Result<UseCaseError> {
    constructor(userId: string) {
      super(false, {
        message: `The timeSlot with userId: ${userId}, already exists in the db`,
      } as UseCaseError);
    }
  }
}
