import { IEvent } from '@nestjs/cqrs';

export default class UserCreatedEvent implements IEvent {
  constructor(public readonly id: string, public readonly email: string) {}
}
