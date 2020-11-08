import { IEvent } from '@nestjs/cqrs';

export default class OfferDeletedEvent implements IEvent {
  constructor(public readonly id: string) {}
}
