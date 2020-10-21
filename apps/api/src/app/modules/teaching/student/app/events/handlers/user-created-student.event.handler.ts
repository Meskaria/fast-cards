import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import UserCreatedEvent from 'apps/api/src/app/modules/user/app/events/implements/user-created.event';
import { Injectable } from '@nestjs/common';
import { CreateStudentUseCase } from 'apps/api/src/app/modules/teaching/student/app/use-cases/create-student/create-student.use-case';
import { USER_ACCESS } from 'apps/api/src/app/modules/user/domain/model/user';

@Injectable()
@EventsHandler(UserCreatedEvent)
export class UserCreatedStudentEventHandler
  implements IEventHandler<UserCreatedEvent> {
  constructor(private readonly useCase: CreateStudentUseCase) {}

  async handle({ id, access }: UserCreatedEvent) {
    if (access === USER_ACCESS.STUDENT)
      await this.useCase.execute({ userId: id });
  }
}
