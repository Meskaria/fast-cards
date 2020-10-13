import { Module } from '@nestjs/common';
import { TimeSlotRepository } from './infra/repos/time-slot.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTimeSlotUseCase } from 'apps/api/src/app/modules/teaching/time-slot/app/use-cases/create-time-slot/create-time-slot.use-case';
import { UserCreatedTimeSlotEventHandler } from 'apps/api/src/app/modules/teaching/time-slot/app/events/handlers/user-created-time-slot.event.handler';

@Module({
  providers: [
    CreateTimeSlotUseCase,
    UserCreatedTimeSlotEventHandler,
    TimeSlotRepository,
  ],
  imports: [CqrsModule],
})
export class TimeSlotModule {}
