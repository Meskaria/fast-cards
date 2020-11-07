import { Module } from '@nestjs/common';
import { TimeSlotRepository } from './infra/repos/time-slot.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { TimeSlotController } from 'apps/api/src/app/modules/teaching/time-slot/infra/http/time-slot.controller';
import { TimeSlotService } from 'apps/api/src/app/modules/teaching/time-slot/infra/service/time-slot.service';
import useCases from 'apps/api/src/app/modules/teaching/time-slot/app/use-cases';

@Module({
  controllers: [TimeSlotController],
  providers: [...useCases, TimeSlotRepository, TimeSlotService],
  imports: [CqrsModule],
})
export class TimeSlotModule {}
