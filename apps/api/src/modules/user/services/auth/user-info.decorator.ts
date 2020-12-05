import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@app/modules/user/domain/model/user';

export const UserData = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  }
);
