import { Injectable } from '@nestjs/common';
import { UseCase } from '@app/shared/core/UseCase';
import { Either, left, Result, right } from '@app/shared/core/Result';
import { AppError } from '@app/shared/core/AppError';
import { CreateTimeSlotDto } from '@app/modules/teaching/time-slot/dtos/create-time-slot.dto';
import { TimeSlotRepository } from '@app/modules/teaching/time-slot/repos/time-slot.repository';
import { TimeSlot } from '@app/modules/teaching/time-slot/domain/model/time-slot';
import { TimeSlotService } from '@app/modules/teaching/time-slot/service/time-slot.service';

export type Response = Either<AppError.UnexpectedError, Result<TimeSlot[]>>;

class GetTimeSlotsByRangeProps extends CreateTimeSlotDto {
  mentorId: string;
}

@Injectable()
export class GetTimeSlotsByRangeUseCase
  implements UseCase<GetTimeSlotsByRangeProps, Promise<Response>> {
  constructor(
    private readonly timeSlotRepo: TimeSlotRepository,
    private readonly timeSlotService: TimeSlotService
  ) {}

  async execute({
    mentorId,
    slots,
  }: GetTimeSlotsByRangeProps): Promise<Response> {
    try {
      const calculatedSlots = this.timeSlotService.calculateRange(slots);
      const timeSlots = await this.timeSlotRepo.getManyRange(
        calculatedSlots,
        mentorId
      );
      return right(Result.ok<TimeSlot[]>(timeSlots));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
