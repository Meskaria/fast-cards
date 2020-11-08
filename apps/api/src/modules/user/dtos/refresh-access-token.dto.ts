import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { RefreshToken } from 'apps/api/src/modules/user/domain/jwt';

export class RefreshAccessTokenDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  refreshToken: RefreshToken;
}
