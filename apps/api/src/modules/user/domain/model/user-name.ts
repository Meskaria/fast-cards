import { Result } from '@app/shared/core/Result';
import { ValueObject } from '@app/shared/domain/ValueObject';
import { Guard } from '@app/shared/core/Guard';

interface UserNameProps {
  name: string;
}
export type UserNameAnemic = UserNameProps;

export class UserName extends ValueObject<UserNameProps> {
  public static maxLength = 15;
  public static minLength = 2;

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
    if (usernameResult.isFailure) {
      return Result.fail<UserName>(usernameResult.errorValue());
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.name);
    if (minLengthResult.isFailure) {
      return Result.fail<UserName>(minLengthResult.errorValue());
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.name);
    if (maxLengthResult.isFailure) {
      return Result.fail<UserName>(minLengthResult.errorValue());
    }

    return Result.ok<UserName>(new UserName(props));
  }
}
