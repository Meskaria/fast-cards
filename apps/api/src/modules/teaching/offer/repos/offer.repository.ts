import { PrismaService } from '@app/shared/infra/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Repository } from '@app/shared/infra/Repository';
import { Offer } from '@app/modules/teaching/offer/domain/model/offer';
import { OfferMap } from '@app/modules/teaching/offer/mappers/offer.map';
import { Result } from '@app/shared/core/Result';

export interface IOfferRepo {
  getOfferByOfferId(offerId: string): Promise<Result<Offer>>;
  save(offer: Offer): Promise<Offer>;
  getAllOffersByMentorId(mentorId: string): Promise<Offer[]>;
}

@Injectable()
export class OfferRepository extends Repository implements IOfferRepo {
  constructor(private prisma: PrismaService) {
    super();
  }

  async getAllOffersByMentorId(mentorId: string): Promise<Offer[]> {
    const offers = await this.prisma.offer.findMany({
      where: {
        mentorId,
      },
    });
    if (!offers) throw new Error('Offer not found.');

    return offers.map((offer) => OfferMap.fromPersistence(offer));
  }

  async getOfferByOfferId(offerId: string): Promise<Result<Offer>> {
    const offer = await this.prisma.offer.findOne({
      where: {
        id: offerId,
      },
    });

    if(!offer){
      return Result.fail('Not found')
    }

    return Result.ok(OfferMap.fromPersistence(offer));
  }

  async save(offer: Offer): Promise<Offer> {
    const { mentorId, ...rawOffer } = await OfferMap.toPersistence(offer);
    const offerModel = await this.prisma.offer.upsert({
      where: {
        id: rawOffer.id,
      },
      create: {
        ...rawOffer,
        mentor: {
          connect: {
            id: mentorId,
          },
        },
      },
      update: {
        isDeleted: rawOffer.isDeleted,
      },
    });

    return OfferMap.fromPersistence(offerModel);
  }
}
