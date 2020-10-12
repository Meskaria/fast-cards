import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import UserCreatedEvent from 'apps/api/src/app/modules/user/app/events/implements/user-created.event';
import { Injectable } from '@nestjs/common';
import { CreateStudentUseCase } from 'apps/api/src/app/modules/teaching/student/app/use-cases/create-student/create-student.use-case';

@Injectable()
@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent> {
  constructor(private readonly useCase: CreateStudentUseCase) {}

  async handle({ id }: UserCreatedEvent) {
    // just an example
    await this.useCase.execute({ userId: id });
  }
}
