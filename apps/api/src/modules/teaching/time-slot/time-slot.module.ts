import { Module } from '@nestjs/common';
import { TimeSlotRepository } from 'apps/api/src/modules/teaching/time-slot/repos/time-slot.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { TimeSlotController } from 'apps/api/src/modules/teaching/time-slot/controllers/time-slot.controller';
import { TimeSlotService } from 'apps/api/src/modules/teaching/time-slot/service/time-slot.service';
import UseCases from 'apps/api/src/modules/teaching/time-slot/use-cases';

@Module({
  controllers: [TimeSlotController],
  providers: [...UseCases, TimeSlotRepository, TimeSlotService],
  imports: [CqrsModule],
})
export class TimeSlotModule {}
