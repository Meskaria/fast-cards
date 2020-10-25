import { UniqueEntityID } from 'apps/api/src/app/shared/domain/UniqueEntityID';
import { Injectable } from '@nestjs/common';
import { Offer as OfferEntity } from '@prisma/client';
import { Mapper } from 'apps/api/src/app/shared/infra/Mapper';
import { Offer } from 'apps/api/src/app/modules/teaching/offer/domain/model/offer';
import { OfferSerializerDto } from 'apps/api/src/app/modules/teaching/offer/infra/http/serializers/offer.serializer';

@Injectable()
export class OfferMap implements Mapper<Offer, OfferEntity> {
  public static async toDTO(offer: Offer): Promise<OfferSerializerDto> {
    return {
      id: offer.id.value.toString(),
      mentor: offer.mentorId,
      timeSlotsCount: offer.timeSlotsCount,
      price: offer.price,
      isDeleted: offer.isDeleted,
    };
  }

  public static fromPersistence(raw: OfferEntity): Offer {
    return new Offer(
      {
        mentorId: raw.mentorId,
        price: raw.price,
        timeSlotsCount: raw.timeSlotsCount,
        isDeleted: raw.isDeleted,
      },
      new UniqueEntityID(raw.id)
    );
  }

  public static async toPersistence(
    offer: Offer
  ): Promise<Omit<OfferEntity, 'createdAt' | 'updatedAt'>> {
    return {
      id: offer.id.value.toString(),
      mentorId: offer.mentorId,
      price: offer.price,
      timeSlotsCount: offer.timeSlotsCount,
      isDeleted: offer.isDeleted,
    };
  }
}
