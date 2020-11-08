export interface OfferSerializerDto {
  id: string;
  mentor: string;
  timeSlotsCount: number;
  price: number;
  isDeleted?: boolean;
}

export class OfferSerializer implements OfferSerializerDto {
  id: string;
  mentor: string;
  timeSlotsCount: number;
  price: number;
  isDeleted: boolean;

  constructor(offer: OfferSerializerDto) {
    Object.assign(this, offer);
  }
}
