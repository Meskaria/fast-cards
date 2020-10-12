import { Module } from '@nestjs/common';
import { UserCreatedEventHandler } from './app/events/handlers/user-created.event.handler';
import { StudentRepository } from './infra/repos/student.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateStudentUseCase } from 'apps/api/src/app/modules/teaching/student/app/use-cases/create-student/create-student.use-case';

@Module({
  providers: [CreateStudentUseCase, UserCreatedEventHandler, StudentRepository],
  imports: [CqrsModule],
})
export class StudentModule {}
