import { Module } from '@nestjs/common';
import { MentorModule } from './mentor/mentor.module';
import { StudentModule } from './student/student.module';
import { OfferModule } from './offer/offer.module';

@Module({
  imports: [MentorModule, StudentModule, OfferModule]
})
export class TeachingModule {}
