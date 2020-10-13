import { Module } from '@nestjs/common';
import { MentorModule } from './mentor/mentor.module';
import { StudentModule } from './student/student.module';
import { OfferModule } from './offer/offer.module';
import { TimeSlotModule } from './time-slot/time-slot.module';

@Module({
  imports: [MentorModule, StudentModule, OfferModule, TimeSlotModule]
})
export class TeachingModule {}
