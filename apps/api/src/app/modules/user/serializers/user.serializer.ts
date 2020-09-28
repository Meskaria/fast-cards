import { Exclude } from 'class-transformer';
import { USER_ACCESS } from '../domain/user';

export interface UserDto {
  id: string;
  name: string;
  surname: string;
  access: USER_ACCESS;
  isDeleted?: boolean;
  email: string;
  password: string;
}
export class UserSerializer implements UserDto {
  id: string;
  name: string;
  surname: string;
  access: USER_ACCESS;
  isDeleted?: boolean;
  email: string;

  @Exclude()
  password: string;

  constructor(user: UserDto) {
    Object.assign(this, user)
  }
}
