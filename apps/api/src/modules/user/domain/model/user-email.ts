import { Result } from '@app/shared/core/Result';
import { ValueObject } from '@app/shared/domain/ValueObject';

export interface UserEmailProps {
  email: string;
}

export type UserEmailAnemic = UserEmailProps;

export class UserEmail extends ValueObject<UserEmailProps> {
  get value(): string {
    return this.props.email;
  }
  toAnemic(): UserEmailAnemic {
    return {
      email: this.value,
    };
  }

  private constructor(props: UserEmailProps) {
    super(props);
  }

  private static isValidEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }

  public static create(email: string): Result<UserEmail> {
    if (!this.isValidEmail(email)) {
      return Result.fail<UserEmail>('Email address not valid');
    } else {
      return Result.ok<UserEmail>(new UserEmail({ email: this.format(email) }));
    }
  }
}
