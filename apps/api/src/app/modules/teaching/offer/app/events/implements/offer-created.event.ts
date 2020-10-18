import { IEvent } from '@nestjs/cqrs';

export default class OfferCreatedEvent implements IEvent {
  constructor(public readonly id: string) {}
}
