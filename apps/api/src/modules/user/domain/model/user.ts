import { UserEmail } from '@app/modules/user/domain/model/user-email';
import { UserName } from '@app/modules/user/domain/model/user-name';
import { UserId } from '@app/modules/user/domain/model/user-id';
import { UserPassword } from '@app/modules/user/domain/model/user-password';
import { UniqueEntityID } from '@app/shared/domain/UniqueEntityID';
import { Result } from '@app/shared/core/Result';
import { Guard } from '@app/shared/core/Guard';
import { AggregateRoot } from '@app/shared/domain/AggregateRoot';
import { UserSurname } from '@app/modules/user/domain/model/user-surname';
import { JWTToken, RefreshToken } from '@app/modules/user/domain/jwt';
import UserDeletedEvent from '@app/modules/user/events/implements/user-deleted.event';
import UserCreatedEvent from '@app/modules/user/events/implements/user-created.event';

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
  accessToken?: JWTToken ;
  refreshToken?: RefreshToken;
  lastLogin?: Date | undefined;
  isEmailVerified?: boolean;
  mentorId?: string ;
  studentId?: string ;
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
    return !!this.props.isDeleted;
  }

  get access(): USER_ACCESS {
    return this.props.access;
  }

  get accessToken(): string | undefined{
    return this.props.accessToken;
  }

  get isEmailVerified(): boolean {
    return !!this.props.isEmailVerified;
  }

  get lastLogin(): Date | undefined {
    return this.props.lastLogin;
  }

  get refreshToken(): RefreshToken | undefined {
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
    this.props.accessToken = undefined;
    this.props.refreshToken = undefined;
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

    if (guardResult.isFailure) {
      return Result.fail<User>(guardResult.errorValue());
    }
    const user = new User(props, id);

    user.apply(new UserCreatedEvent(user.id.value.toString(), user.access));
    return Result.ok<User>(user);
  }
}
