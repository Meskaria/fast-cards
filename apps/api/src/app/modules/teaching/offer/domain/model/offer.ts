import { UniqueEntityID } from 'apps/api/src/app/shared/domain/UniqueEntityID';
import { Result } from 'apps/api/src/app/shared/core/Result';
import { AggregateRoot } from 'apps/api/src/app/shared/domain/AggregateRoot';
import { OfferId } from 'apps/api/src/app/modules/teaching/offer/domain/model/offer-id';
import OfferCreatedEvent from 'apps/api/src/app/modules/teaching/offer/app/events/implements/offer-created.event';
import OfferDeletedEvent from 'apps/api/src/app/modules/teaching/offer/app/events/implements/offer-deleted.event';

interface OfferProps {
  mentorId: string;
  timeSlotsCount: number;
  price: number;
  isDeleted?: boolean;
}

export class Offer extends AggregateRoot<OfferProps> {
  get id(): OfferId {
    return OfferId.create(this._id).getValue();
  }

  get mentorId(): string {
    return this.props.mentorId;
  }

  get price(): number {
    return this.props.price;
  }

  get timeSlotsCount(): number {
    return this.props.timeSlotsCount;
  }

  get isDeleted(): boolean {
    return this.props.isDeleted;
  }

  constructor(props: OfferProps, id: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: OfferProps,
    id: UniqueEntityID
  ): Result<Offer> {
    const offer = new Offer(props, id);

    offer.apply(new OfferCreatedEvent(offer.id.value.toString()));
    return Result.ok<Offer>(offer);
  }

  public delete() {
    if (!this.props.isDeleted) {
      this.props.isDeleted = true;
      this.apply(
        new OfferDeletedEvent(this.id.value.toString())
      );
    }
  }
}
