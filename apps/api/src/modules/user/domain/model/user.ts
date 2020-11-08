import { UserEmail } from 'apps/api/src/modules/user/domain/model/user-email';
import { UserName } from 'apps/api/src/modules/user/domain/model/user-name';
import { UserId } from 'apps/api/src/modules/user/domain/model/user-id';
import { UserPassword } from 'apps/api/src/modules/user/domain/model/user-password';
import { UniqueEntityID } from 'apps/api/src/shared/domain/UniqueEntityID';
import { Result } from 'apps/api/src/shared/core/Result';
import { Guard } from 'apps/api/src/shared/core/Guard';
import { AggregateRoot } from 'apps/api/src/shared/domain/AggregateRoot';
import { UserSurname } from 'apps/api/src/modules/user/domain/model/user-surname';
import { JWTToken, RefreshToken } from 'apps/api/src/modules/user/domain/jwt';
import UserDeletedEvent from 'apps/api/src/modules/user/events/implements/user-deleted.event';
import UserCreatedEvent from 'apps/api/src/modules/user/events/implements/user-created.event';

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
  mentorId?: string;
  studentId?: string;
}

export class User extends AggregateRoot<UserProps> {
  get id(): UserId {
    return UserId.create(this._id).getValue();
  }

  get mentorId(): string | undefined {
    return this.props.mentorId;
  }

  get studentId(): string | undefined {
    return this.props.studentId;
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
      this.clearAccessToken();

      this.apply(
        new UserDeletedEvent(this.id.value.toString(), this.email.value)
      );
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

  public clearAccessToken(): void {
    this.props.accessToken = null;
    this.props.refreshToken = null;
  }

  constructor(props: UserProps, id: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: UserProps, id: UniqueEntityID): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
      { argument: props.surname, argumentName: 'surname' },
      { argument: props.password, argumentName: 'password' },
      { argument: props.access, argumentName: 'access' },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message);
    }
    const user = new User(props, id);

    user.apply(new UserCreatedEvent(user.id.value.toString(), user.access));
    return Result.ok<User>(user);
  }
}
