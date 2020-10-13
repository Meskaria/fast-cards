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
