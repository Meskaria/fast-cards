import { IEvent } from '@nestjs/cqrs';

export default class UserDeletedEvent implements IEvent {
  constructor(public readonly id: string, public readonly email: string) {}
}
