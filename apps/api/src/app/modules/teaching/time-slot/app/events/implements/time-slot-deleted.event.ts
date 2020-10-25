import { IEvent } from '@nestjs/cqrs';

export default class TimeSlotDeletedEvent implements IEvent {
  constructor(public readonly id: string) {}
}
