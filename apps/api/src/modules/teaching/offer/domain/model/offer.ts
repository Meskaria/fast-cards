import { UniqueEntityID } from '@app/shared/domain/UniqueEntityID';
import { Result } from '@app/shared/core/Result';
import { AggregateRoot } from '@app/shared/domain/AggregateRoot';
import { OfferId } from '@app/modules/teaching/offer/domain/model/offer-id';
import OfferCreatedEvent from '@app/modules/teaching/offer/events/implements/offer-created.event';
import OfferDeletedEvent from '@app/modules/teaching/offer/events/implements/offer-deleted.event';
import { Guard } from '@app/shared/core/Guard';

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
    return !!this.props.isDeleted;
  }

  constructor(props: OfferProps, id: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: OfferProps, id: UniqueEntityID): Result<Offer> {
    const requiredGuardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.mentorId, argumentName: 'mentorId' },
      { argument: props.timeSlotsCount, argumentName: 'timeSlotsCount' },
      { argument: props.price, argumentName: 'price' },
    ]);

    const timeSlotsInRangeGuardResult = Guard.inRange(
      props.timeSlotsCount,
      1,
      8,
      'timeSlotsCount'
    );
    const priceGuardResult = Guard.greaterThan(1, props.price);

    const combinedGuardResults = Guard.combine([
      requiredGuardResult,
      timeSlotsInRangeGuardResult,
      priceGuardResult,
    ]);

    if (combinedGuardResults.isFailure) {
      return Result.fail<Offer>(combinedGuardResults.errorValue());
    }
    const offer = new Offer(props, id);

    offer.apply(new OfferCreatedEvent(offer.id.value.toString()));
    return Result.ok<Offer>(offer);
  }

  public delete() {
    if (!this.props.isDeleted) {
      this.props.isDeleted = true;
      this.apply(new OfferDeletedEvent(this.id.value.toString()));
    }
  }
}
