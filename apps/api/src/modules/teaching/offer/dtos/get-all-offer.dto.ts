import { IsNotEmpty, IsString } from 'class-validator';

export class GetAllOfferDto {
  @IsNotEmpty()
  @IsString()
  mentorId: string;
}
