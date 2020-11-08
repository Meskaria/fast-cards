import { UniqueEntityID } from 'apps/api/src/shared/domain/UniqueEntityID';
import { Result } from 'apps/api/src/shared/core/Result';
import { AggregateRoot } from 'apps/api/src/shared/domain/AggregateRoot';
import { TimeSlotId } from 'apps/api/src/modules/teaching/time-slot/domain/model/time-slot-id';
import TimeSlotCreatedEvent from 'apps/api/src/modules/teaching/time-slot/events/implements/time-slot-created.event';
import UserDeletedEvent from 'apps/api/src/modules/user/events/implements/user-deleted.event';
import TimeSlotDeletedEvent from 'apps/api/src/modules/teaching/time-slot/events/implements/time-slot-deleted.event';

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
