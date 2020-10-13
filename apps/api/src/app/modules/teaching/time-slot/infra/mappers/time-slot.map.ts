import { UniqueEntityID } from 'apps/api/src/app/shared/domain/UniqueEntityID';
import { Injectable } from '@nestjs/common';
import { TimeSlot as TimeSlotEntity } from '@prisma/client';
import { Mapper } from 'apps/api/src/app/shared/infra/Mapper';
import { TimeSlot } from '../../domain/model/time-slot';
import { TimeSlotDto } from '../http/serializers/time-slot.serializer';

@Injectable()
export class TimeSlotMap implements Mapper<TimeSlot, TimeSlotEntity> {
  public static async toDTO(timeSlot: TimeSlot): Promise<TimeSlotDto> {
    return {
      id: timeSlot.id.value.toString(),
      mentorId: timeSlot.mentorId,
      start: timeSlot.start,
      end: timeSlot.end,
      lessonId: timeSlot.scheduledLessonId,
    };
  }
  public static fromResistance(raw: TimeSlotEntity): TimeSlot {
    return new TimeSlot(
      {
        mentorId: raw.mentorId,
        start: raw.start,
        end: raw.end,
        scheduledLessonId: raw.scheduledLessonId,
      },
      new UniqueEntityID(raw.id)
    );
  }

  public static async toResistance(
    timeSlot: TimeSlot
  ): Promise<Omit<TimeSlotEntity, 'createdAt' | 'updatedAt'>> {
    return {
      id: timeSlot.id.value.toString(),
      mentorId: timeSlot.mentorId,
      start: timeSlot.start,
      end: timeSlot.end,
      lessonId: timeSlot.scheduledLessonId,
    };
  }
}
