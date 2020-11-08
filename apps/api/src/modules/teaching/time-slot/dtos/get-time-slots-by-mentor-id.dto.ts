import { IsUUID } from 'class-validator';

export class GetTimeSlotsByMentorIdDto {
  @IsUUID()
  mentorId: string;
}
