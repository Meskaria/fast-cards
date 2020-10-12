import { Module } from '@nestjs/common';
import { StudentRepository } from './infra/repos/student.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateStudentUseCase } from 'apps/api/src/app/modules/teaching/student/app/use-cases/create-student/create-student.use-case';
import { UserCreatedStudentEventHandler } from 'apps/api/src/app/modules/teaching/student/app/events/handlers/user-created-student.event.handler';

@Module({
  providers: [
    CreateStudentUseCase,
    UserCreatedStudentEventHandler,
    StudentRepository,
  ],
  imports: [CqrsModule],
})
export class StudentModule {}
