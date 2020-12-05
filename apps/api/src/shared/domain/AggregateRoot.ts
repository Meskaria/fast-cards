import { AggregateRoot as AggregateRootNest, IEvent } from '@nestjs/cqrs';
import { UniqueEntityID } from '@app/shared/domain/UniqueEntityID';

export abstract class AggregateRoot<T> extends AggregateRootNest {
  protected readonly _id: UniqueEntityID;
  public readonly props: T;

  protected constructor(props: T, id: UniqueEntityID) {
    super();
    this._id = id;
    this.props = props;
  }

  public apply<E extends IEvent>(event: E, isFromHistory?: boolean) {
    this.logDomainEventAdded(event);
    super.apply(event, isFromHistory);
    console.count('apply');
  }

  public commit() {
    this.logDomainEventsCommitted();
    super.commit();
    console.count('commit');
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
  private logDomainEventsCommitted(): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const uncommitted = super.getUncommittedEvents();

    const domainEventClass = uncommitted
      .map(
        (domainEvent) => Reflect.getPrototypeOf(domainEvent).constructor.name
      )
      .join(',');
    console.info(
      `[Domain Event Committed]:`,
      thisClass.constructor.name,
      '==>',
      domainEventClass
    );
  }
}
