import { IsInt, Min, Max, IsUUID } from 'class-validator';

export class CreateOfferDto {
  @IsInt()
  @Min(1)
  @Max(8)
  timeSlotsCount: number;

  @IsInt()
  @Min(1)
  price: number;
}

export class CreateOfferWithMentorIdDto extends CreateOfferDto {
  @IsUUID()
  mentorId: string;
}
