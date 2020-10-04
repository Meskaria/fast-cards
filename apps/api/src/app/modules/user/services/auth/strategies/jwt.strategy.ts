import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GetUserByUserEmailUseCase } from 'apps/api/src/app/modules/user/use-cases/get-user-by-user-email/get-user-by-user-email.use-case';
import { GetUserByUserNameErrors } from 'apps/api/src/app/modules/user/use-cases/get-user-by-user-email/get-user-by-user-email.errors';

interface JWTPayload {
  email: string,
  userId: string,
  int: string,
  exp: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly getUserByUserEmailUseCase: GetUserByUserEmailUseCase) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });

  }

  public async validate(payload: JWTPayload, done: Function) {
    const result = await this.getUserByUserEmailUseCase.execute({ email: payload.email });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case GetUserByUserNameErrors.UserNotFoundError:
          throw new UnauthorizedException(error.errorValue().message);

      }
    } else {
      done(null, result.value.getValue());
    }
  }
}
