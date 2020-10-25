import { UseCaseError } from 'apps/api/src/app/shared/core/UseCaseError';
import { Result } from 'apps/api/src/app/shared/core/Result';
import { TimeSlot } from 'apps/api/src/app/modules/teaching/time-slot/domain/model/time-slot';

export namespace CreateTimeSlotsErrors {
  export class TimeSlotAlreadyExistsError extends Result<UseCaseError> {
    constructor(timeSlotsAlreadyExist: TimeSlot[]) {
      const timeSlots = timeSlotsAlreadyExist.map((timeSlot) => ({
        since: timeSlot.since,
        till: timeSlot.till,
      }));
      super(false, {
        message: `TimeSlots in provided time, already exists in the db. ${JSON.stringify(
          timeSlots
        )} `,
      } as UseCaseError);
    }
  }
  export class DbError extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, {
        message,
      } as UseCaseError);
    }
  }
}
