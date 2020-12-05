import { UseCaseError } from '@app/shared/core/UseCaseError';
import { Result } from '@app/shared/core/Result';
import { TimeSlot } from '@app/modules/teaching/time-slot/domain/model/time-slot';
import { difference } from 'lodash';

export namespace DeleteTimeSlotsErrors {
  export class TimeSlotsDoesNotExistsError extends Result<UseCaseError> {
    constructor(
      timeSlotExisting: TimeSlot[],
      calculatedSlots: { start: string; end: string }[]
    ) {
      const timeSlotsSince = timeSlotExisting.map((timeSlot) => timeSlot.since);
      const calculatedSlotsStart = calculatedSlots.map(
        (timeSlot) => timeSlot.start
      );
      const missingSlots = difference(calculatedSlotsStart, timeSlotsSince);
      super(false, {
        message: `TimeSlots in provided time, does not exists in the db. ${JSON.stringify(
          missingSlots
        )} `,
      } as UseCaseError);
    }
  }
}
