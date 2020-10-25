import { Exclude } from 'class-transformer';
import { USER_ACCESS } from 'apps/api/src/app/modules/user/domain/model/user';

export interface UserDto {
  id: string;
  name: string;
  surname: string;
  access: USER_ACCESS;
  isDeleted?: boolean;
  email: string;
  password: string;
  refreshToken?: string;
  accessToken?: string;
  lastLogin?: string;
  studentId?: string;
  mentorId?: string;
}
export class UserSerializer implements UserDto {
  id: string;
  name: string;
  surname: string;
  access: USER_ACCESS;
  isDeleted: boolean;
  email: string;
  studentId?: string;
  mentorId?: string;

  @Exclude()
  lastLogin?: string;

  @Exclude()
  refreshToken?: string;

  @Exclude()
  accessToken?: string;

  @Exclude()
  password: string;

  constructor(user: UserDto) {
    Object.assign(this, user);
  }
}
