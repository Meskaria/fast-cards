import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { USER_ACCESS } from 'apps/api/src/modules/user/domain/model/user';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(USER_ACCESS)
  access: USER_ACCESS;
}
