import { UniqueEntityID } from 'apps/api/src/app/shared/domain/UniqueEntityID';
import { Result } from 'apps/api/src/app/shared/core/Result';
import { Entity } from 'apps/api/src/app/shared/domain/Entity';


// TODO consider taking this out to an abstraction
export class OfferId extends Entity<any> {
  get value(): UniqueEntityID {
    return this._id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id: UniqueEntityID): Result<OfferId> {
    return Result.ok<OfferId>(new OfferId(id));
  }
}
