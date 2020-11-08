import { Injectable } from '@nestjs/common';
import { UseCase } from 'apps/api/src/shared/core/UseCase';
import { EventPublisher } from '@nestjs/cqrs';
import { Either, left, Result, right } from 'apps/api/src/shared/core/Result';
import { AppError } from 'apps/api/src/shared/core/AppError';
import { OfferRepository } from 'apps/api/src/modules/teaching/offer/repos/offer.repository';
import { DeleteOfferErrors } from 'apps/api/src/modules/teaching/offer/use-cases/delete-offer/delete-offer.errors';
import { DeleteOfferDto } from './delete-offer.dto';

export type Response = Either<
  DeleteOfferErrors.NonExistentOfferError | AppError.UnexpectedError,
  Result<void>
>;

@Injectable()
export class DeleteOfferUseCase
  implements UseCase<DeleteOfferDto, Promise<Response>> {
  constructor(
    private offerRepo: OfferRepository,
    private publisher: EventPublisher
  ) {}

  async execute({ offerId }: DeleteOfferDto): Promise<Response> {
    try {
      const offer = await this.offerRepo.getOfferByOfferId(offerId);

      if (!offer || offer.isDeleted) {
        return left(
          new DeleteOfferErrors.NonExistentOfferError(offerId)
        ) as Response;
      }

      offer.delete();
      await this.offerRepo.save(offer);

      this.publisher.mergeObjectContext(offer).commit();

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
