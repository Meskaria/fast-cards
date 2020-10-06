import { RefreshToken } from 'apps/api/src/app/modules/user/domain/jwt';

export interface RefreshAccessTokenDto {
  refreshToken: RefreshToken;
}
