import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { USER_ACCESS } from '@app/modules/user/domain/model/user';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: USER_ACCESS })
  @IsString()
  @IsNotEmpty()
  @IsEnum(USER_ACCESS)
  access: USER_ACCESS;
}
