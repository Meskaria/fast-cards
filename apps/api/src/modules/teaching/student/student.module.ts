import { Module } from '@nestjs/common';
import { StudentRepository } from 'apps/api/src/modules/teaching/student/repos/student.repository';
import { CqrsModule } from '@nestjs/cqrs';
import UseCases from 'apps/api/src/modules/teaching/student/use-cases';
import { UserCreatedStudentEventHandler } from 'apps/api/src/modules/teaching/student/events/handlers/user-created-student.event.handler';

@Module({
  providers: [UserCreatedStudentEventHandler, StudentRepository, ...UseCases],
  imports: [CqrsModule],
})
export class StudentModule {}
