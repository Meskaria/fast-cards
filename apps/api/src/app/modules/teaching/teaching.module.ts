import { Module } from '@nestjs/common';
import { MentorModule } from './mentor/mentor.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [MentorModule, StudentModule]
})
export class TeachingModule {}
