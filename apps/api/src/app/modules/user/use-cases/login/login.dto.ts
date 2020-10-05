import { JWTToken, RefreshToken } from '../../domain/jwt';
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
