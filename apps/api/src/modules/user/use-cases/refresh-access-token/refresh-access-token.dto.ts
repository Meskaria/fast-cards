import { RefreshToken } from 'apps/api/src/modules/user/domain/jwt';

export interface RefreshAccessTokenDto {
  refreshToken: RefreshToken;
}
