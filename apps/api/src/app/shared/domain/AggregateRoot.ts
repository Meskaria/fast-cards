import { AggregateRoot as AggregateRootNest, IEvent } from '@nestjs/cqrs';
import { UniqueEntityID } from './UniqueEntityID';

export abstract class AggregateRoot<T> extends AggregateRootNest {
  protected readonly _id: UniqueEntityID;
  public readonly props: T;

  protected constructor(props: T, id: UniqueEntityID) {
    super();
    this._id = id;
    this.props = props;
  }

  public apply<E extends IEvent>(event: E, isFromHistory?: boolean) {
    super.apply(event, isFromHistory);
    this.logDomainEventAdded(event);
  }

  private logDomainEventAdded(domainEvent: IEvent): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const domainEventClass = Reflect.getPrototypeOf(domainEvent);
    console.info(
      `[Domain Event Created]:`,
      thisClass.constructor.name,
      '==>',
      domainEventClass.constructor.name
    );
  }
}
