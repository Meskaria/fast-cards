import { Module } from '@nestjs/common';
import UseCases from 'apps/api/src/modules/teaching/mentor/use-cases';
import { UserCreatedEventHandler } from 'apps/api/src/modules/teaching/mentor/events/handlers/user-created.event.handler';
import { MentorRepository } from 'apps/api/src/modules/teaching/mentor/repos/mentor.repository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  providers: [...UseCases, UserCreatedEventHandler, MentorRepository],
  imports: [CqrsModule],
})
export class MentorModule {}
