import { Result } from 'apps/api/src/app/shared/core/Result';
import { ValueObject } from 'apps/api/src/app/shared/domain/ValueObject';
import { Guard } from 'apps/api/src/app/shared/core/Guard';

interface UserSurnameProps {
  surname: string;
}
export type UserSurnameAnemic = UserSurnameProps;

export class UserSurname extends ValueObject<UserSurnameProps> {
  public static maxLength: number = 15;
  public static minLength: number = 2;

  get value(): string {
    return this.props.surname;
  }

  toAnemic(): UserSurnameAnemic {
    return {
      surname: this.value,
    };
  }

  private constructor(props: UserSurnameProps) {
    super(props);
  }

  public static create(props: UserSurnameProps): Result<UserSurname> {
    const userSurnameResult = Guard.againstNullOrUndefined(
      props.surname,
      'userSurname'
    );
    if (!userSurnameResult.succeeded) {
      return Result.fail<UserSurname>(userSurnameResult.message);
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.surname);
    if (!minLengthResult.succeeded) {
      return Result.fail<UserSurname>(minLengthResult.message);
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.surname);
    if (!maxLengthResult.succeeded) {
      return Result.fail<UserSurname>(minLengthResult.message);
    }

    return Result.ok<UserSurname>(new UserSurname(props));
  }
}
