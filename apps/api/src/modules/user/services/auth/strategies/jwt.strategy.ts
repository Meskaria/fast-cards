import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GetUserByUserEmailUseCase } from '@app/modules/user/use-cases/get-user-by-user-email/get-user-by-user-email.use-case';
import { GetUserByUserEmailErrors } from '@app/modules/user/use-cases/get-user-by-user-email/get-user-by-user-email.errors';
import { AuthService } from '@app/modules/user/services/auth/auth.service';

interface JWTPayload {
  email: string;
  userId: string;
  int: string;
  exp: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly getUserByUserEmailUseCase: GetUserByUserEmailUseCase,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public async validate(payload: JWTPayload, done: Function) {
    const result = await this.getUserByUserEmailUseCase.execute({
      email: payload.email,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case GetUserByUserEmailErrors.UserNotFoundError:
          throw new UnauthorizedException(error.errorValue().message);
      }
    } else {
      const tokens = await this.authService.getTokens(payload.email);

      if (tokens.length === 0) {
        throw new UnauthorizedException();
      }
      done(null, result.value.getValue());
    }
  }
}
