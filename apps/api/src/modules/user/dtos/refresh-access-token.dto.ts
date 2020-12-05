import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { RefreshToken } from '@app/modules/user/domain/jwt';

export class RefreshAccessTokenDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  refreshToken: RefreshToken;
}
