import { Result } from 'apps/api/src/shared/core/Result';
import { ValueObject } from 'apps/api/src/shared/domain/ValueObject';
import { Guard } from 'apps/api/src/shared/core/Guard';

interface UserNameProps {
  name: string;
}
export type UserNameAnemic = UserNameProps;

export class UserName extends ValueObject<UserNameProps> {
  public static maxLength: number = 15;
  public static minLength: number = 2;

  get value(): string {
    return this.props.name;
  }
  toAnemic(): UserNameAnemic {
    return {
      name: this.value,
    };
  }

  private constructor(props: UserNameProps) {
    super(props);
  }

  public static create(props: UserNameProps): Result<UserName> {
    const usernameResult = Guard.againstNullOrUndefined(props.name, 'username');
    if (!usernameResult.succeeded) {
      return Result.fail<UserName>(usernameResult.message);
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.name);
    if (!minLengthResult.succeeded) {
      return Result.fail<UserName>(minLengthResult.message);
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.name);
    if (!maxLengthResult.succeeded) {
      return Result.fail<UserName>(minLengthResult.message);
    }

    return Result.ok<UserName>(new UserName(props));
  }
}
