import { UniqueEntityID } from 'apps/api/src/shared/domain/UniqueEntityID';
import { Result } from 'apps/api/src/shared/core/Result';
import { AggregateRoot } from 'apps/api/src/shared/domain/AggregateRoot';
import { MentorId } from 'apps/api/src/modules/teaching/mentor/domain/model/mentor-id';
import MentorCreatedEvent from 'apps/api/src/modules/teaching/mentor/events/implements/mentor-created.event';

interface MentorProps {
  userId: string;
}

export class Mentor extends AggregateRoot<MentorProps> {
  get id(): MentorId {
    return MentorId.create(this._id).getValue();
  }

  get userId(): string {
    return this.props.userId;
  }

  async toAnemic() {
    return {
      id: this.id.value.toString(),
      userId: this.userId.toString(),
    };
  }

  constructor(props: MentorProps, id: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: MentorProps, id: UniqueEntityID): Result<Mentor> {
    const mentor = new Mentor(props, id);

    mentor.apply(new MentorCreatedEvent(mentor.id.value.toString()));
    return Result.ok<Mentor>(mentor);
  }
}
