import { Module } from '@nestjs/common';
import { MentorModule } from './mentor/mentor.module';

@Module({
  imports: [MentorModule]
})
export class TeachingModule {}
