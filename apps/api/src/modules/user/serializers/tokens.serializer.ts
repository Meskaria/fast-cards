import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export interface ITokensSerializer {
  accessToken: string;
  refreshToken: string;
}
export class TokensSerializer implements ITokensSerializer {
  @ApiProperty()
  @Expose()
  accessToken: string;

  @ApiProperty()
  @Expose()
  refreshToken: string;

  constructor(user: ITokensSerializer) {
    Object.assign(this, user);
  }
}
