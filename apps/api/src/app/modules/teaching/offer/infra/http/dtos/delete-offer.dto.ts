import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteOfferDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
