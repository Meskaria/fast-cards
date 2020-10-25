import { IEvent } from '@nestjs/cqrs';

export default class MentorCreatedEvent implements IEvent {
  constructor(public readonly id: string, public readonly price: number, public readonly timeSlotsCount) {}
}
