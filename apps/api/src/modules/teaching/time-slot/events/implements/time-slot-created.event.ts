import { IEvent } from '@nestjs/cqrs';

export default class TimeSlotCreatedEvent implements IEvent {
  constructor(public readonly id: string) {}
}
