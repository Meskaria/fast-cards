import { Injectable } from '@nestjs/common';
import { UseCase } from 'apps/api/src/app/shared/core/UseCase';
import {
  Either,
  left,
  Result,
  right,
} from 'apps/api/src/app/shared/core/Result';
import { AppError } from 'apps/api/src/app/shared/core/AppError';
import { TimeSlotRepository } from '../../../infra/repos/time-slot.repository';
import { TimeSlot } from '../../../domain/model/time-slot';

export type Response = Either<AppError.UnexpectedError, Result<TimeSlot[]>>;

class GetTimeSlotsProps {
  mentorId: string;
}

@Injectable()
export class GetTimeSlotsUseCase
  implements UseCase<GetTimeSlotsProps, Promise<Response>> {
  constructor(private readonly timeSlotRepo: TimeSlotRepository) {}

  async execute({ mentorId }: GetTimeSlotsProps): Promise<Response> {
    try {
      const timeSlots = await this.timeSlotRepo.getManyByMentorId(mentorId);
      return right(Result.ok<TimeSlot[]>(timeSlots));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
