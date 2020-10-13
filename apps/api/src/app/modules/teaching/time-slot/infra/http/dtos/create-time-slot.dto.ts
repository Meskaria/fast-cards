import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTimeSlotDto {
  @IsUUID()
  @IsNotEmpty()
  mentorId: string;

  @IsDate()
  @IsNotEmpty()
  start: Date;

  @IsDate()
  @IsNotEmpty()
  end: Date;
}
