import { Module } from '@nestjs/common';
import { StudentRepository } from '@app/modules/teaching/student/repos/student.repository';
import { CqrsModule } from '@nestjs/cqrs';
import UseCases from '@app/modules/teaching/student/use-cases';
import { UserCreatedStudentEventHandler } from '@app/modules/teaching/student/events/handlers/user-created-student.event.handler';

@Module({
  providers: [UserCreatedStudentEventHandler, StudentRepository, ...UseCases],
  imports: [CqrsModule],
})
export class StudentModule {}
