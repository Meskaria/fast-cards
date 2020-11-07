import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { SlotDto } from 'apps/api/src/app/modules/teaching/time-slot/infra/http/dtos/create-time-slot.dto';

export interface Range {
  start: string;
  end: string;
}

@Injectable()
export class TimeSlotService {
  private SLOT_IN_MINUTES = 15;

  /**
   * Prepares db range items in given time slots
   * @param slots
   */
  public calculateRange(slots: SlotDto[]): Range[] {
    return slots
      .map(({ since, till }) => {
        const duration = moment(till).diff(moment(since));
        const slotsCount =
          moment.duration(duration).asMinutes() / this.SLOT_IN_MINUTES;
        return Array.from(Array(slotsCount)).map((_, idx) => {
          return {
            start: moment(since)
              .add(idx * this.SLOT_IN_MINUTES, 'minute')
              .toISOString(),
            end: moment(since)
              .add((idx + 1) * this.SLOT_IN_MINUTES, 'minute')
              .toISOString(),
          };
        });
      })
      .flat();
  }
}
