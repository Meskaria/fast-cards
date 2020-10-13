import { UniqueEntityID } from 'apps/api/src/app/shared/domain/UniqueEntityID';
import { Result } from 'apps/api/src/app/shared/core/Result';
import { AggregateRoot } from 'apps/api/src/app/shared/domain/AggregateRoot';
import { TimeSlotId } from './time-slot-id';
import TimeSlotCreatedEvent from '../../app/events/implements/time-slot-created.event';

interface TimeSlotProps {
  mentorId: string;
  start: Date;
  end: Date;
  scheduledLessonId: string;
}

export class TimeSlot extends AggregateRoot<TimeSlotProps> {
  get id(): TimeSlotId {
    return TimeSlotId.create(this._id).getValue();
  }

  get mentorId(): string {
    return this.props.mentorId;
  }

  get start(): Date {
    return this.props.start;
  }

  get end(): Date {
    return this.props.end;
  }

  get scheduledLessonId(): string {
    return this.props.scheduledLessonId;
  }

  constructor(props: TimeSlotProps, id: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: TimeSlotProps,
    id: UniqueEntityID
  ): Result<TimeSlot> {
    const timeSlot = new TimeSlot(props, id);

    TimeSlot.apply(new TimeSlotCreatedEvent(timeSlot.id.value.toString()));
    return Result.ok<TimeSlot>(timeSlot);
  }
}
