import { IsUUID } from 'class-validator';
import { CreateOfferDto } from 'apps/api/src/modules/teaching/offer/dtos';

export class CreateOfferWithMentorIdDto extends CreateOfferDto {
  @IsUUID()
  mentorId: string;
}
