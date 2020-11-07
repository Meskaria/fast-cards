import { UniqueEntityID } from 'apps/api/src/app/shared/domain/UniqueEntityID';
import { Result } from 'apps/api/src/app/shared/core/Result';
import { AggregateRoot } from 'apps/api/src/app/shared/domain/AggregateRoot';
import { TimeSlotId } from './time-slot-id';
import TimeSlotCreatedEvent from '../../app/events/implements/time-slot-created.event';
import UserDeletedEvent from 'apps/api/src/app/modules/user/app/events/implements/user-deleted.event';
import TimeSlotDeletedEvent from 'apps/api/src/app/modules/teaching/time-slot/app/events/implements/time-slot-deleted.event';

interface TimeSlotProps {
  mentorId: string;
  since: string;
  till: string;
  scheduledLessonId: string;
}

export class TimeSlot extends AggregateRoot<TimeSlotProps> {
  get id(): TimeSlotId {
    return TimeSlotId.create(this._id).getValue();
  }

  get mentorId(): string {
    return this.props.mentorId;
  }

  get since(): string {
    return this.props.since;
  }

  get till(): string {
    return this.props.till;
  }

  get scheduledLessonId(): string {
    return this.props.scheduledLessonId;
  }

  public delete() {
    this.apply(new TimeSlotDeletedEvent(this.id.value.toString()));
  }
  constructor(props: TimeSlotProps, id: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: TimeSlotProps,
    id: UniqueEntityID
  ): Result<TimeSlot> {
    const timeSlot = new TimeSlot(props, id);
    timeSlot.apply(new TimeSlotCreatedEvent(timeSlot.id.value.toString()));
    return Result.ok<TimeSlot>(timeSlot);
  }
}
