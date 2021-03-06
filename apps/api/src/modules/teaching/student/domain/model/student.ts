import { UniqueEntityID } from '@app/shared/domain/UniqueEntityID';
import { Result } from '@app/shared/core/Result';
import { AggregateRoot } from '@app/shared/domain/AggregateRoot';
import { StudentId } from '@app/modules/teaching/student/domain/model/student-id';
import StudentCreatedEvent from '@app/modules/teaching/student/events/implements/student-created.event';

interface StudentProps {
  userId: string;
}

export class Student extends AggregateRoot<StudentProps> {
  get id(): StudentId {
    return StudentId.create(this._id).getValue();
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

  constructor(props: StudentProps, id: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: StudentProps,
    id: UniqueEntityID
  ): Result<Student> {
    const student = new Student(props, id);

    student.apply(new StudentCreatedEvent(student.id.value.toString()));
    return Result.ok<Student>(student);
  }
}
