import { ApiProperty } from '@nestjs/swagger';

export interface OfferSerializerDto {
  id: string;
  mentorId: string;
  timeSlotsCount: number;
  price: number;
  isDeleted?: boolean;
}

export class OfferSerializer implements OfferSerializerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  mentorId: string;

  @ApiProperty()
  timeSlotsCount: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  isDeleted: boolean;

  constructor(offer: OfferSerializerDto) {
    Object.assign(this, offer);
  }
}
