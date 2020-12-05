import {
  ApiProperty,
  ApiPropertyOptional,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';

export interface TimeSlotDto {
  id: string;
  mentorId: string;
  start: string;
  end: string;
  lessonId: string | null;
}

export class TimeSlotSerializer implements TimeSlotDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  mentorId: string;

  @ApiProperty()
  start: string;

  @ApiProperty()
  end: string;

  @ApiPropertyOptional({nullable: true})
  lessonId: string | null;

  constructor(TimeSlot: TimeSlotDto) {
    Object.assign(this, TimeSlot);
  }
}

export class TimeSlotCollectionSerializer {
  @ApiResponseProperty({ type: [TimeSlotSerializer] })
  @Type(() => TimeSlotSerializer)
  data?: TimeSlotDto[];

  constructor(timeSlots: TimeSlotDto[]) {
    this.data = timeSlots;
  }
}
