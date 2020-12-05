import * as jwt from 'jsonwebtoken';
import { uid } from 'rand-token';
import {
  JWTClaims,
  JWTToken,
  RefreshToken,
} from '@app/modules/user/domain/jwt';
import { User } from '@app/modules/user/domain/model/user';
import { Injectable } from '@nestjs/common';
import { RedisService } from '@app/modules/redis/redis.service';
import { ConfigService } from '@nestjs/config';

/**
 * @class JWTClient
 * @desc This class is responsible for persisting JWTs to redis
 * and for signing tokens. It should also be responsible for determining their
 * validity.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService
  ) {}

  public jwtHashName = 'activeJwtClients';

  public async refreshTokenExists(
    refreshToken: RefreshToken
  ): Promise<boolean> {
    const keys = await this.redisService.getAllKeys(`*${refreshToken}*`);
    return keys.length !== 0;
  }

  public async getUserEmailFromRefreshToken(
    refreshToken: RefreshToken
  ): Promise<string> {
    const keys = await this.redisService.getAllKeys(`*${refreshToken}*`);
    const exists = keys.length !== 0;

    if (!exists) throw new Error('Email not found for refresh token.');

    const key = keys[0];

    return key.substring(
      key.indexOf(this.jwtHashName) + this.jwtHashName.length + 1
    );
  }

  public async saveAuthenticatedUser(user: User): Promise<void> {
    if (user.isLoggedIn()) {
      await this.addToken(
        user.email.value,
        user.refreshToken as string,
        user.accessToken as string,
      );
    }
  }

  public async deAuthenticateUser(email: string): Promise<void> {
    await this.clearAllSessions(email);
  }

  public createRefreshToken(): RefreshToken {
    return uid(256) as RefreshToken;
  }

  /**
   * @function signJWT
   * @desc Signs the JWT token using the server secret with some claims
   * about the current user.
   */

  public signJWT(props: JWTClaims): JWTToken {
    const claims: JWTClaims = {
      email: props.email,
      userId: props.userId,
      isEmailVerified: props.isEmailVerified,
    };

    return jwt.sign(claims, this.configService.get('JWT_SECRET') as string, {
      expiresIn: this.configService.get('JWT_TOKEN_EXPIRY_TIME'),
    });
  }

  private constructKey(email: string, refreshToken: RefreshToken): string {
    return `refresh-${refreshToken}.${this.jwtHashName}.${email}`;
  }

  /**
   * @method addToken
   * @desc Adds the token for this user to redis.
   *
   * @return Promise<any>
   * @param email
   * @param refreshToken
   * @param token
   */

  public addToken(
    email: string,
    refreshToken: RefreshToken,
    token: JWTToken
  ): Promise<any> {
    return this.redisService.set(this.constructKey(email, refreshToken), token);
  }

  /**
   * @method clearAllTokens
   * @desc Clears all jwt tokens from redis. Usually useful for testing.
   * @return Promise<any>
   */

  public async clearAllTokens(): Promise<any> {
    const allKeys = await this.redisService.getAllKeys(`*${this.jwtHashName}*`);
    return Promise.all(allKeys.map((key) => this.redisService.del(key)));
  }

  /**
   * @method countSessions
   * @desc Counts the total number of sessions for a particular user.
   * @return Promise<number>
   * @param email
   */

  public countSessions(email: string): Promise<number> {
    return this.redisService.count(`*${this.jwtHashName}.${email}`);
  }

  /**
   * @method countTokens
   * @desc Counts the total number of sessions for a particular user.
   * @return Promise<number>
   */

  public countTokens(): Promise<number> {
    return this.redisService.count(`*${this.jwtHashName}*`);
  }

  /**
   * @method getTokens
   * @desc Gets the user's tokens that are currently active.
   * @return Promise<string[]>
   */

  public async getTokens(email: string): Promise<string[]> {
    const keyValues = await this.redisService.getAllKeyValue(
      `*${this.jwtHashName}.${email}`
    );
    return keyValues.map((kv) => kv.value);
  }

  /**
   * @method getToken
   * @desc Gets a single token for the user.
   * @return Promise<string>
   * @param email
   * @param refreshToken
   */

  public async getToken(email: string, refreshToken: string): Promise<string> {
    return this.redisService.get(this.constructKey(email, refreshToken));
  }

  /**
   * @method clearToken
   * @desc Deletes a single user's session token.
   * @return Promise<string>
   * @param email
   * @param refreshToken
   */

  public async clearToken(email: string, refreshToken: string): Promise<any> {
    return this.redisService.del(this.constructKey(email, refreshToken));
  }

  /**
   * @method clearAllSessions
   * @desc Clears all active sessions for the current user.
   * @return Promise<any>
   * @param email
   */

  public async clearAllSessions(email: string): Promise<any> {
    const keyValues = await this.redisService.getAllKeyValue(
      `*${this.jwtHashName}.${email}`
    );
    const keys = keyValues.map((kv) => kv.key);
    return Promise.all(keys.map((key) => this.redisService.del(key)));
  }

  /**
   * @method sessionExists
   * @desc Checks if the session for this user exists
   * @return Promise<boolean>
   * @param email
   * @param refreshToken
   */

  public async sessionExists(
    email: string,
    refreshToken: string
  ): Promise<boolean> {
    const token = await this.getToken(email, refreshToken);
    return !!token;
  }
}
