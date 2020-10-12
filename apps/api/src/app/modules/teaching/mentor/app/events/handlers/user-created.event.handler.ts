import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import UserCreatedEvent from 'apps/api/src/app/modules/user/app/events/implements/user-created.event';
import { Injectable } from '@nestjs/common';
import { CreateMentorUseCase } from '../../use-cases/create-mentor/create-mentor.use-case';

@Injectable()
@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent> {

  constructor(private readonly useCase: CreateMentorUseCase) {}

  async handle({id}: UserCreatedEvent) {
    // just an example
    await this.useCase.execute({userId: id})
  }
}
