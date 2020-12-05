import { IsUUID } from 'class-validator';
import { CreateOfferDto } from '@app/modules/teaching/offer/dtos';

export class CreateOfferWithMentorIdDto extends CreateOfferDto {
  @IsUUID()
  mentorId: string;
}
