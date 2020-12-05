import { Injectable } from '@nestjs/common';
import { UseCase } from '@app/shared/core/UseCase';
import { Either, left, Result, right } from '@app/shared/core/Result';
import { AppError } from '@app/shared/core/AppError';
import { CreateTimeSlotDto } from '@app/modules/teaching/time-slot/dtos/create-time-slot.dto';
import { TimeSlotRepository } from '@app/modules/teaching/time-slot/repos/time-slot.repository';
import { TimeSlot } from '@app/modules/teaching/time-slot/domain/model/time-slot';
import { DeleteTimeSlotsErrors } from '@app/modules/teaching/time-slot/use-cases/delete-time-slots/delete-time-slots.errors';
import { TimeSlotService } from '@app/modules/teaching/time-slot/service/time-slot.service';

export type Response = Either<
  DeleteTimeSlotsErrors.TimeSlotsDoesNotExistsError | AppError.UnexpectedError,
  Result<void>
>;

class DeleteTimeSlotProps extends CreateTimeSlotDto {
  mentorId: string;
}

@Injectable()
export class DeleteTimeSlotsUseCase
  implements UseCase<DeleteTimeSlotProps, Promise<Response>> {
  constructor(
    private readonly timeSlotRepo: TimeSlotRepository,
    private readonly timeSlotService: TimeSlotService
  ) {}

  async execute({ mentorId, slots }: DeleteTimeSlotProps): Promise<Response> {
    const calculatedSlots = this.timeSlotService.calculateRange(slots);

    const timeSlotExistingOrError = await this.timeSlotRepo.getManyRange(
      calculatedSlots,
      mentorId
    );
    if (timeSlotExistingOrError.length !== calculatedSlots.length) {
      return left(
        new DeleteTimeSlotsErrors.TimeSlotsDoesNotExistsError(
          timeSlotExistingOrError,
          calculatedSlots
        )
      ) as Response;
    }

    try {
      timeSlotExistingOrError.map((timeSlot) => timeSlot.delete());

      const timeSlotsOrError = await this.timeSlotRepo.deleteMany(
        timeSlotExistingOrError
      );

      if (timeSlotsOrError.isFailure) {
        return left(
          Result.fail<TimeSlot>(timeSlotsOrError.errorValue() as string)
        ) as Response;
      }

      // TODO publish multiple events (Agragate root should be a collection)
      // timeSlots.forEach((timeSlot) => {
      //   const savedTimeSlot = this.publisher.mergeObjectContext(timeSlot);
      //   savedTimeSlot.commit();
      // });

      return right(Result.ok());
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
