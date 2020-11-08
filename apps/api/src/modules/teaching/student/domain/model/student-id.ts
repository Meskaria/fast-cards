import { UniqueEntityID } from 'apps/api/src/shared/domain/UniqueEntityID';
import { Result } from 'apps/api/src/shared/core/Result';
import { Entity } from 'apps/api/src/shared/domain/Entity';

export class StudentId extends Entity<any> {
  get value(): UniqueEntityID {
    return this._id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id: UniqueEntityID): Result<StudentId> {
    return Result.ok<StudentId>(new StudentId(id));
  }
}
