import {
  JWTToken,
  RefreshToken,
} from 'apps/api/src/app/modules/user/domain/jwt';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export interface LoginDTOResponse {
  accessToken: JWTToken;
  refreshToken: RefreshToken;
}
