import { UniqueEntityID } from '@app/shared/domain/UniqueEntityID';
import { Result } from '@app/shared/core/Result';
import { Entity } from '@app/shared/domain/Entity';

export class StudentId extends Entity<any> {
  get value(): UniqueEntityID {
    return this._id;
  }

  private constructor(id: UniqueEntityID) {
    super(null, id);
  }

  public static create(id: UniqueEntityID): Result<StudentId> {
    return Result.ok<StudentId>(new StudentId(id));
  }
}
