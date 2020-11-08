import { Exclude } from 'class-transformer';
import { USER_ACCESS } from 'apps/api/src/modules/user/domain/model/user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty({ enum: USER_ACCESS })
  access: USER_ACCESS;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  studentId?: string;

  @ApiPropertyOptional()
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
