import { Result } from '@app/shared/core/Result';
import { ValueObject } from '@app/shared/domain/ValueObject';
import { Guard } from '@app/shared/core/Guard';

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
    if (userSurnameResult.isFailure) {
      return Result.fail<UserSurname>(userSurnameResult.errorValue());
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.surname);
    if (minLengthResult.isFailure) {
      return Result.fail<UserSurname>(minLengthResult.errorValue());
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.surname);
    if (maxLengthResult.isFailure) {
      return Result.fail<UserSurname>(minLengthResult.errorValue());
    }

    return Result.ok<UserSurname>(new UserSurname(props));
  }
}
