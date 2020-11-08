import { IsUUID } from 'class-validator';

export class DeleteOfferDto {
  @IsUUID()
  offerId: string;
}
