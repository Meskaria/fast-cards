import { IEvent } from '@nestjs/cqrs';

export default class StudentCreatedEvent implements IEvent {
  constructor(public readonly id: string) {}
}
