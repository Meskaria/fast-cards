import { ApiResponseProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export interface TimeSlotDto {
  id: string;
  mentorId: string;
  start: string;
  end: string;
  lessonId?: string;
}

export class TimeSlotSerializer implements TimeSlotDto {
  id: string;
  mentorId: string;
  start: string;
  end: string;
  lessonId?: string;

  constructor(TimeSlot: TimeSlotDto) {
    Object.assign(this, TimeSlot);
  }
}

export class TimeSlotCollectionSerializer {
  @ApiResponseProperty({ type: [TimeSlotSerializer] })
  @Type(() => TimeSlotSerializer)
  data?: TimeSlotSerializer[];

  constructor(timeSlots: TimeSlotSerializer[]) {
    this.data = timeSlots;
  }
}
