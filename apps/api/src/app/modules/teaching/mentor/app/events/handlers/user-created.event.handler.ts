import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import UserCreatedEvent from 'apps/api/src/app/modules/user/app/events/implements/user-created.event';
import { Injectable } from '@nestjs/common';
import { CreateMentorUseCase } from '../../use-cases/create-mentor/create-mentor.use-case';
import { USER_ACCESS } from 'apps/api/src/app/modules/user/domain/model/user';

@Injectable()
@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent> {
  constructor(private readonly useCase: CreateMentorUseCase) {}

  async handle({ id, access }: UserCreatedEvent) {
    if (access === USER_ACCESS.MENTOR)
      await this.useCase.execute({ userId: id });
  }
}
