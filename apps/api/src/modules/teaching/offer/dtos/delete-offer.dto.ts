import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteOfferDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  offerId: string;
}
