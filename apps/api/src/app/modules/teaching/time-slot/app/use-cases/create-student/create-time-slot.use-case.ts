import { Injectable } from '@nestjs/common';
import { UseCase } from 'apps/api/src/app/shared/core/UseCase';
import {
  Either,
  left,
  Result,
  right,
} from 'apps/api/src/app/shared/core/Result';
import { AppError } from 'apps/api/src/app/shared/core/AppError';
import { UniqueEntityID } from 'apps/api/src/app/shared/domain/UniqueEntityID';
import { EventPublisher } from '@nestjs/cqrs';
import { CreateTimeSlotDto } from '../../../infra/http/dtos/create-time-slot.dto';
import { TimeSlotRepository } from '../../../infra/repos/time-slot.repository';
import { TimeSlot } from '../../../domain/model/time-slot';
import { CreateTimeSlotErrors } from './create-time-slot.errors';

export type Response = Either<
  CreateTimeSlotErrors.TimeSlotAlreadyExistsError | AppError.UnexpectedError,
  Result<TimeSlot>
>;

@Injectable()
export class CreateTimeSlotUseCase
  implements UseCase<CreateTimeSlotDto, Promise<Response>> {
  constructor(
    private timeSlotRepo: TimeSlotRepository,
    private publisher: EventPublisher
  ) {}

  async execute({
    mentorId,
    start,
    end,
  }: CreateTimeSlotDto): Promise<Response> {
    // TODO add guards
    const dtoResult = Result.combine([]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.error)) as Response;
    }

    try {
      const timeSlotAlreadyExists = await this.timeSlotRepo.exists(start, end);

      if (timeSlotAlreadyExists) {
        return left(
          new CreateTimeSlotErrors.TimeSlotAlreadyExistsError(mentorId)
        ) as Response;
      }

      const nextTimeSlotId = this.timeSlotRepo.nextId();
      const timeSlotOrError: Result<TimeSlot> = TimeSlot.create(
        { start, end, scheduledLessonId: null, mentorId },
        new UniqueEntityID(nextTimeSlotId)
      );

      if (timeSlotOrError.isFailure) {
        return left(
          Result.fail<TimeSlot>(timeSlotOrError.error.toString())
        ) as Response;
      }

      const timeSlot: TimeSlot = timeSlotOrError.getValue();
      await this.timeSlotRepo.save(timeSlot);

      const savedTimeSlot = this.publisher.mergeObjectContext(timeSlot);

      savedTimeSlot.commit();

      return right(Result.ok<TimeSlot>(savedTimeSlot));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
