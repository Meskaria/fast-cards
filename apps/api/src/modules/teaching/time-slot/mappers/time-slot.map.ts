import { UniqueEntityID } from '@app/shared/domain/UniqueEntityID';
import { Injectable } from '@nestjs/common';
import { TimeSlot as TimeSlotEntity } from '@prisma/client';
import { Mapper } from '@app/shared/infra/Mapper';
import { TimeSlot } from '@app/modules/teaching/time-slot/domain/model/time-slot';
import { TimeSlotDto } from '@app/modules/teaching/time-slot/serializers/time-slot.serializer';

@Injectable()
export class TimeSlotMap implements Mapper<TimeSlot, TimeSlotEntity> {
  public static toDTO(timeSlot: TimeSlot): TimeSlotDto {
    return {
      id: timeSlot.id.value.toString(),
      mentorId: timeSlot.mentorId,
      start: timeSlot.since,
      end: timeSlot.till,
      lessonId: timeSlot.scheduledLessonId,
    };
  }
  public static toDTOBulk(timeSlots: TimeSlot[]): TimeSlotDto[] {
    return timeSlots.map(TimeSlotMap.toDTO);
  }

  public static fromPersistence(raw: TimeSlotEntity): TimeSlot {
    return new TimeSlot(
      {
        mentorId: raw.mentorId,
        since: raw.start.toString(),
        till: raw.end.toString(),
        scheduledLessonId: raw.scheduledLessonId,
      },
      new UniqueEntityID(raw.id)
    );
  }

  public static toPersistence(
    timeSlot: TimeSlot
  ): Omit<TimeSlotEntity, 'createdAt' | 'updatedAt'> {
    return {
      id: timeSlot.id.value.toString(),
      mentorId: timeSlot.mentorId,
      start: (timeSlot.since as unknown) as Date,
      end: (timeSlot.till as unknown) as Date,
      scheduledLessonId: timeSlot.scheduledLessonId,
    };
  }

  public static toPersistenceBulk(timeSlots: TimeSlot[]) {
    return timeSlots.map(TimeSlotMap.toPersistence);
  }
}
