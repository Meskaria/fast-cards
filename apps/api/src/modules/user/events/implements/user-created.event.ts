import { IEvent } from '@nestjs/cqrs';
import { USER_ACCESS } from 'apps/api/src/modules/user/domain/model/user';

export default class UserCreatedEvent implements IEvent {
  constructor(
    public readonly id: string,
    public readonly access: USER_ACCESS
  ) {}
}
