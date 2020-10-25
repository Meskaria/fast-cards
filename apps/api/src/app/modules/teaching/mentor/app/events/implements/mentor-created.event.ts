import { IEvent } from '@nestjs/cqrs';

export default class MentorCreatedEvent implements IEvent {
  constructor(public readonly id: string) {}
}
