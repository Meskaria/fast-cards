import { IsUUID } from 'class-validator';

export class GetAllOfferDto {
  @IsUUID()
  mentorId: string;
}
