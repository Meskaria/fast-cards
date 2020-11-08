import { IsUUID } from 'class-validator';

export class CreateMentorDto {
  @IsUUID()
  userId: string;
}
