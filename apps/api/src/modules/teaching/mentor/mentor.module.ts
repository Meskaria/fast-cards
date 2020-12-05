import { Module } from '@nestjs/common';
import UseCases from '@app/modules/teaching/mentor/use-cases';
import { UserCreatedEventHandler } from '@app/modules/teaching/mentor/events/handlers/user-created.event.handler';
import { MentorRepository } from '@app/modules/teaching/mentor/repos/mentor.repository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  providers: [...UseCases, UserCreatedEventHandler, MentorRepository],
  imports: [CqrsModule],
})
export class MentorModule {}
