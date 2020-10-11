import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import UserCreatedEvent from 'apps/api/src/app/modules/user/app/events/implements/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedEventHandler
  implements IEventHandler<UserCreatedEvent> {
  handle(event: UserCreatedEvent) {
    // just an example
    console.log('UserCreatedEventHandler');
  }
}
