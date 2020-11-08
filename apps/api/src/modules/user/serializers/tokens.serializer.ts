import { Expose } from 'class-transformer';

export interface ITokensSerializer {
  accessToken: string;
  refreshToken: string;
}
export class TokensSerializer implements ITokensSerializer {
  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;

  constructor(user: ITokensSerializer) {
    Object.assign(this, user);
  }
}
