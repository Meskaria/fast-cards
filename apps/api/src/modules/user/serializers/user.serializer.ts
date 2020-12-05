import { Exclude } from 'class-transformer';
import { USER_ACCESS } from '@app/modules/user/domain/model/user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export interface UserDto {
  id: string;
  name: string;
  surname: string;
  access: USER_ACCESS;
  isDeleted?: boolean;
  email: string;
  password: string;
  refreshToken?: string | null;
  accessToken?: string | null;
  lastLogin?: string | null ;
  studentId?: string | null;
  mentorId?: string | null;
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

  @ApiPropertyOptional({nullable: true})
  studentId: string | null;

  @ApiPropertyOptional({nullable: true})
  mentorId: string | null;

  @Exclude()
  lastLogin: string | null;

  @Exclude()
  refreshToken: string | null;

  @Exclude()
  accessToken: string | null;

  @Exclude()
  password: string;

  constructor(user: UserDto) {
    Object.assign(this, user);
  }
}
