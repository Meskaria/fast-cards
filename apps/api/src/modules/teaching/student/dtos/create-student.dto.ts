import { IsUUID } from 'class-validator';

export class CreateStudentDto {
  @IsUUID()
  userId: string;
}
