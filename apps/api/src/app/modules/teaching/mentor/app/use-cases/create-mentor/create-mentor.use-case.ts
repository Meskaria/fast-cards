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
import { CreateMentorDto } from '../../../infra/http/dtos/create-mentor.dto';
import { MentorRepository } from '../../../infra/repos/mentor.repository';
import { Mentor } from '../../../domain/model/mentor';
import { CreateMentorErrors } from './create-mentor.errors';

export type Response = Either<
  CreateMentorErrors.MentorAlreadyExistsError | AppError.UnexpectedError,
  Result<Mentor>
>;

@Injectable()
export class CreateMentorUseCase
  implements UseCase<CreateMentorDto, Promise<Response>> {
  constructor(
    private mentorRepo: MentorRepository,
    private publisher: EventPublisher
  ) {}

  async execute({ userId }: CreateMentorDto): Promise<Response> {
    const dtoResult = Result.combine([]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.error)) as Response;
    }

    try {
      const mentorAlreadyExists = await this.mentorRepo.exists(userId);

      if (mentorAlreadyExists) {
        return left(
          new CreateMentorErrors.MentorAlreadyExistsError(userId)
        ) as Response;
      }

      const nextMentorId = this.mentorRepo.nextId();
      const mentorOrError: Result<Mentor> = Mentor.create(
        { userId },
        new UniqueEntityID(nextMentorId)
      );

      if (mentorOrError.isFailure) {
        return left(
          Result.fail<Mentor>(mentorOrError.error.toString())
        ) as Response;
      }

      const mentor: Mentor = mentorOrError.getValue();
      await this.mentorRepo.save(mentor);

      const savedMentor = this.publisher.mergeObjectContext(mentor);

      savedMentor.commit();

      return right(Result.ok<Mentor>(savedMentor));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
