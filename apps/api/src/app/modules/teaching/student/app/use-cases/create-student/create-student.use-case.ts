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
import { CreateStudentDto } from '../../../infra/http/dtos/create-student.dto';
import { StudentRepository } from '../../../infra/repos/student.repository';
import { Student } from '../../../domain/model/student';
import { CreateStudentErrors } from './create-student.errors';

export type Response = Either<
  CreateStudentErrors.StudentAlreadyExistsError | AppError.UnexpectedError,
  Result<Student>
>;

@Injectable()
export class CreateStudentUseCase
  implements UseCase<CreateStudentDto, Promise<Response>> {
  constructor(
    private studentRepo: StudentRepository,
    private publisher: EventPublisher
  ) {}

  async execute({ userId }: CreateStudentDto): Promise<Response> {
    const dtoResult = Result.combine([]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.error)) as Response;
    }

    try {
      const studentAlreadyExists = await this.studentRepo.exists(userId);

      if (studentAlreadyExists) {
        return left(
          new CreateStudentErrors.StudentAlreadyExistsError(userId)
        ) as Response;
      }

      const nextStudentId = this.studentRepo.nextId();
      const studentOrError: Result<Student> = Student.create(
        { userId },
        new UniqueEntityID(nextStudentId)
      );

      if (studentOrError.isFailure) {
        return left(
          Result.fail<Student>(studentOrError.error.toString())
        ) as Response;
      }

      const student: Student = studentOrError.getValue();
      await this.studentRepo.save(student);

      const savedStudent = this.publisher.mergeObjectContext(student);

      savedStudent.commit();

      return right(Result.ok<Student>(savedStudent));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
