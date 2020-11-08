import { Injectable } from '@nestjs/common';
import { UseCase } from 'apps/api/src/shared/core/UseCase';
import { Either, left, Result, right } from 'apps/api/src/shared/core/Result';
import { AppError } from 'apps/api/src/shared/core/AppError';
import { UniqueEntityID } from 'apps/api/src/shared/domain/UniqueEntityID';
import { CreateTimeSlotDto } from 'apps/api/src/modules/teaching/time-slot/dtos/create-time-slot.dto';
import { TimeSlotRepository } from 'apps/api/src/modules/teaching/time-slot/repos/time-slot.repository';
import { TimeSlot } from 'apps/api/src/modules/teaching/time-slot/domain/model/time-slot';
import * as moment from 'moment';
import { TimeSlotService } from 'apps/api/src/modules/teaching/time-slot/service/time-slot.service';
import { CreateTimeSlotsErrors } from 'apps/api/src/modules/teaching/time-slot/use-cases/create-time-slots/create-time-slots.errors';

export type Response = Either<
  CreateTimeSlotsErrors.TimeSlotAlreadyExistsError | AppError.UnexpectedError,
  Result<TimeSlot[]>
>;

class CreateTimeSlotProps extends CreateTimeSlotDto {
  mentorId: string;
}

@Injectable()
export class CreateTimeSlotsUseCase
  implements UseCase<CreateTimeSlotProps, Promise<Response>> {
  constructor(
    private readonly timeSlotRepo: TimeSlotRepository,
    private readonly timeSlotService: TimeSlotService
  ) {}

  async execute({ mentorId, slots }: CreateTimeSlotProps): Promise<Response> {
    const calculatedSlots = this.timeSlotService.calculateRange(slots);
    const timeSlotsAlreadyExist = await this.timeSlotRepo.getManyRange(
      calculatedSlots,
      mentorId
    );
    if (timeSlotsAlreadyExist.length) {
      return left(
        new CreateTimeSlotsErrors.TimeSlotAlreadyExistsError(
          timeSlotsAlreadyExist
        )
      ) as Response;
    }

    try {
      const timeSlotsOrErrors = calculatedSlots.map(({ start, end }) => {
        const nextTimeSlotId = this.timeSlotRepo.nextId();

        return TimeSlot.create(
          {
            since: moment(start).toISOString(),
            till: moment(end).toISOString(),
            scheduledLessonId: undefined,
            mentorId,
          },
          new UniqueEntityID(nextTimeSlotId)
        );
      });
      const flat = timeSlotsOrErrors.flat();
      const timeSlotsResult = Result.combine(flat);

      if (timeSlotsResult.isFailure) {
        return left(
          Result.fail<TimeSlot>(timeSlotsResult.error.toString())
        ) as Response;
      }
      const timeSlots = flat.map((slot) => slot.getValue());

      const savedOrError = await this.timeSlotRepo.createMany(timeSlots);

      if (savedOrError.isFailure) {
        return left(
          new CreateTimeSlotsErrors.DbError(savedOrError.errorValue() as string)
        ) as Response;
      }
      // TODO publish multiple events
      // timeSlots.forEach((timeSlot) => {
      //   const savedTimeSlot = this.publisher.mergeObjectContext(timeSlot);
      //   savedTimeSlot.commit();
      // });

      return right(Result.ok<TimeSlot[]>(timeSlots));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
