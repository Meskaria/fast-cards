import { UserEmail } from './user-email';
import { UserName } from './user-name';
import { UserId } from './user-id';
import { UserPassword } from './user-password';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Result } from '../../../shared/core/Result';
import { Guard } from '../../../shared/core/Guard';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { UserSurname } from './user-surname';
import {
  JWTToken,
  RefreshToken,
} from 'apps/api/src/app/modules/user/domain/jwt';

export enum USER_ACCESS {
  MENTOR = 'MENTOR',
  STUDENT = 'STUDENT',
}

interface UserProps {
  email: UserEmail;
  name: UserName;
  surname: UserSurname;
  password: UserPassword;
  access: USER_ACCESS;
  isDeleted?: boolean;
  accessToken?: JWTToken;
  refreshToken?: RefreshToken;
  lastLogin?: Date;
  isEmailVerified?: boolean;
}

export class User extends AggregateRoot<UserProps> {
  get userId(): UserId {
    return UserId.create(this._id).getValue();
  }

  get email(): UserEmail {
    return this.props.email;
  }

  get name(): UserName {
    return this.props.name;
  }

  get surname(): UserSurname {
    return this.props.surname;
  }

  get password(): UserPassword {
    return this.props.password;
  }

  get isDeleted(): boolean {
    return this.props.isDeleted;
  }

  get access(): USER_ACCESS {
    return this.props.access;
  }

  get accessToken(): string {
    return this.props.accessToken;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  get lastLogin(): Date {
    return this.props.lastLogin;
  }

  get refreshToken(): RefreshToken {
    return this.props.refreshToken;
  }

  public delete() {
    if (!this.props.isDeleted) {
      this.props.isDeleted = true;
    }
  }
  public isLoggedIn(): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken;
  }

  public setAccessToken(token: JWTToken, refreshToken: RefreshToken): void {
    this.props.accessToken = token;
    this.props.refreshToken = refreshToken;
    this.props.lastLogin = new Date();
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
      { argument: props.password, argumentName: 'password' },
      { argument: props.email, argumentName: 'email' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message);
    }

    const user = new User(
      {
        ...props,
        isDeleted: props.isDeleted ? props.isDeleted : false,
      },
      id
    );

    return Result.ok<User>(user);
  }
}
