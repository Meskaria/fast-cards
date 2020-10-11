import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'apps/api/src/app/modules/user/domain/model/user';

export const UserData = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  }
);
