import { Module } from '@nestjs/common';
import { CreateMentorUseCase } from './app/use-cases/create-mentor/create-mentor.use-case';
import { UserCreatedEventHandler } from './app/events/handlers/user-created.event.handler';
import { MentorRepository } from './infra/repos/mentor.repository';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  providers: [CreateMentorUseCase, UserCreatedEventHandler, MentorRepository],
  imports: [CqrsModule]
})
export class MentorModule {}
