import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import UserDeletedEvent from 'apps/api/src/app/modules/user/app/events/implements/user-deleted.event';

@EventsHandler(UserDeletedEvent)
export class UserDeletedEventHandler
  implements IEventHandler<UserDeletedEvent> {
  handle(event: UserDeletedEvent) {
    // just an example
    console.log('UserDeletedEventHandler');
  }
}
