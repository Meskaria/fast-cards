import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(8)
  timeSlotsCount: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  price: number;
}
