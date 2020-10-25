import { PrismaService } from 'apps/api/src/app/shared/infra/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'apps/api/src/app/shared/infra/Repository';
import { TimeSlot } from '../../domain/model/time-slot';
import { TimeSlotMap } from '../mappers/time-slot.map';
import { Result } from 'apps/api/src/app/shared/core/Result';
import { Range } from 'apps/api/src/app/modules/teaching/time-slot/infra/service/time-slot.service';

export interface ITimeSlotRepo {
  exists({ start, end }: Range, mentorId: string): Promise<boolean>;
  getTimeSlotByTimeSlotId(timeSlotId: string): Promise<TimeSlot>;
  create(TimeSlot: TimeSlot): Promise<TimeSlot>;
}

@Injectable()
export class TimeSlotRepository extends Repository implements ITimeSlotRepo {
  constructor(private prisma: PrismaService) {
    super();
  }

  private _deleteById(id: string) {
    return this.prisma.timeSlot.delete({
      where: {
        id,
      },
    });
  }

  public async getTimeSlotByTimeSlotId(timeSlotId: string): Promise<TimeSlot> {
    const timeSlot = await this.prisma.timeSlot.findOne({
      where: {
        id: timeSlotId,
      },
    });
    if (!timeSlot) throw new Error('time-slot not found.');

    return TimeSlotMap.fromPersistence(timeSlot);
  }

  public async getManyByMentorId(mentorId: string): Promise<TimeSlot[]> {
    const rawTimeSlotModels = await this.prisma.timeSlot.findMany({
      where: {
        mentorId,
      },
    });

    return rawTimeSlotModels.map((raw) => {
      return TimeSlotMap.fromPersistence(raw);
    });
  }

  public async exists(
    { start, end }: Range,
    mentorId: string
  ): Promise<boolean> {
    const user = await this.prisma.timeSlot.findFirst({
      where: {
        start,
        end,
        mentorId,
      },
    });

    return !!user;
  }

  public async existsBulk(slots: Range[], mentorId: string): Promise<boolean> {
    const existingSlots = await this.getManyRange(slots, mentorId);

    return !!existingSlots.length;
  }

  public async getManyRange(
    slots: Range[],
    mentorId: string
  ): Promise<TimeSlot[]> {
    const rawTimeSlotModels = await this.prisma.timeSlot.findMany({
      where: {
        OR: slots,
        mentorId,
      },
    });

    return rawTimeSlotModels.map((raw) => {
      return TimeSlotMap.fromPersistence(raw);
    });
  }

  public async createMany(timeSlots: TimeSlot[]) {
    const rawTimeSlots = TimeSlotMap.toPersistenceBulk(timeSlots);
    try {
      await this.prisma.$transaction(
        rawTimeSlots.map((rawTimeSlot) =>
          this.prisma.timeSlot.create({
            data: {
              id: rawTimeSlot.id,
              start: rawTimeSlot.start,
              end: rawTimeSlot.end,
              mentor: {
                connect: {
                  id: rawTimeSlot.mentorId,
                },
              },
            },
          })
        )
      );
      return Result.ok<void>();
    } catch (e) {
      return Result.fail<string>(e.message);
    }
  }

  public async create(TimeSlot: TimeSlot): Promise<TimeSlot> {
    const rawTimeSlot = TimeSlotMap.toPersistence(TimeSlot);
    const TimeSlotModel = await this.prisma.timeSlot.create({
      data: {
        id: rawTimeSlot.id,
        start: rawTimeSlot.start,
        end: rawTimeSlot.end,
        mentor: {
          connect: {
            id: rawTimeSlot.mentorId,
          },
        },
      },
    });

    return TimeSlotMap.fromPersistence(TimeSlotModel);
  }

  public async deleteMany(timeSlots: TimeSlot[]) {
    const rawTimeSlots = TimeSlotMap.toPersistenceBulk(timeSlots);
    try {
      await this.prisma.$transaction(
        rawTimeSlots.map((rawTimeSlot) => this._deleteById(rawTimeSlot.id))
      );
      return Result.ok<void>();
    } catch (e) {
      return Result.fail<string>(e.message);
    }
  }

  public async delete(timeSlot: TimeSlot) {
    const rawTimeSlot = TimeSlotMap.toPersistence(timeSlot);
    try {
      this._deleteById(rawTimeSlot.id);
      return Result.ok<void>();
    } catch (e) {
      return Result.fail<string>(e.message);
    }
  }
}
