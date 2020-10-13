import { PrismaService } from 'apps/api/src/app/shared/infra/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'apps/api/src/app/shared/infra/Repository';
import { TimeSlot } from '../../domain/model/time-slot';
import { TimeSlotMap } from '../mappers/time-slot.map';

export interface ITimeSlotRepo {
  exists(start: Date, end: Date): Promise<boolean>;
  getTimeSlotByTimeSlotId(TimeSlotId: string): Promise<TimeSlot>;
  save(TimeSlot: TimeSlot): Promise<TimeSlot>;
}

@Injectable()
export class TimeSlotRepository extends Repository implements ITimeSlotRepo {
  constructor(private prisma: PrismaService) {
    super();
  }

  async getTimeSlotByTimeSlotId(TimeSlotId: string): Promise<TimeSlot> {
    const timeSlot = await this.prisma.timeSlot.findOne({
      where: {
        id: TimeSlotId,
      },
    });
    if (!timeSlot) throw new Error('time-slot not found.');

    return TimeSlotMap.fromResistance(timeSlot);
  }

  async exists(start: Date, end: Date): Promise<boolean> {
    const user = await this.prisma.timeSlot.findFirst({
      where: {
        start,
        end,
      },
    });

    return !!user;
  }

  async save(TimeSlot: TimeSlot): Promise<TimeSlot> {
    const rawTimeSlot = await TimeSlotMap.toResistance(TimeSlot);
    const TimeSlotModel = await this.prisma.timeSlot.upsert({
      where: {
        id: rawTimeSlot.id,
      },
      create: {
        id: rawTimeSlot.id,
        start: rawTimeSlot.start,
        end: rawTimeSlot.end,
        mentor: {
          connect: {
            id: rawTimeSlot.mentorId,
          },
        },
        scheduledLesson: null,
      },
      update: {
        scheduledLesson: {
          connect: {
            id: rawTimeSlot.scheduledLessonId,
          },
        },
      },
    });

    return TimeSlotMap.fromResistance(TimeSlotModel);
  }
}
