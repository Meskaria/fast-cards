import { Module } from '@nestjs/common';
import { MentorModule } from '@app/modules/teaching/mentor/mentor.module';
import { StudentModule } from '@app/modules/teaching/student/student.module';
import { OfferModule } from '@app/modules/teaching/offer/offer.module';
import { TimeSlotModule } from '@app/modules/teaching/time-slot/time-slot.module';

@Module({
  imports: [MentorModule, StudentModule, OfferModule, TimeSlotModule],
})
export class TeachingModule {}
