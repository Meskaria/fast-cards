import { RefreshToken } from '@app/modules/user/domain/jwt';

export interface RefreshAccessTokenDto {
  refreshToken: RefreshToken;
}
