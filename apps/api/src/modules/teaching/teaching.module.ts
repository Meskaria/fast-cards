import { Module } from '@nestjs/common';
import { MentorModule } from 'apps/api/src/modules/teaching/mentor/mentor.module';
import { StudentModule } from 'apps/api/src/modules/teaching/student/student.module';
import { OfferModule } from 'apps/api/src/modules/teaching/offer/offer.module';
import { TimeSlotModule } from 'apps/api/src/modules/teaching/time-slot/time-slot.module';

@Module({
  imports: [MentorModule, StudentModule, OfferModule, TimeSlotModule],
})
export class TeachingModule {}
