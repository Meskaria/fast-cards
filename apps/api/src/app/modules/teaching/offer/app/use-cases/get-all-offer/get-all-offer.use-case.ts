import { Injectable } from '@nestjs/common';
import { UseCase } from 'apps/api/src/app/shared/core/UseCase';
import {
  Either,
  left,
  Result,
  right,
} from 'apps/api/src/app/shared/core/Result';
import { AppError } from 'apps/api/src/app/shared/core/AppError';
import { GetAllOfferDto } from 'apps/api/src/app/modules/teaching/offer/infra/http/dtos/get-all-offer.dto';
import { OfferRepository } from 'apps/api/src/app/modules/teaching/offer/infra/repos/offer.repository';
import { Offer } from 'apps/api/src/app/modules/teaching/offer/domain/model/offer';
import { GetAllOfferErrors } from 'apps/api/src/app/modules/teaching/offer/app/use-cases/get-all-offer/get-all-offer.errors';

export type Response = Either<
  GetAllOfferErrors.NoOffersForGivenMentorId | AppError.UnexpectedError,
  Result<Offer[]>
>;

@Injectable()
export class GetAllOfferUseCase
  implements UseCase<GetAllOfferDto, Promise<Response>> {
  constructor(private offerRepo: OfferRepository) {}

  async execute({mentorId}: GetAllOfferDto): Promise<Response> {
    try {
      const offers = await this.offerRepo.getAllOffersByMentorId(mentorId);

      if (!offers) {
        return left(
          new GetAllOfferErrors.NoOffersForGivenMentorId(mentorId)
        ) as Response;
      }

      return right(Result.ok<Offer[]>(offers));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}