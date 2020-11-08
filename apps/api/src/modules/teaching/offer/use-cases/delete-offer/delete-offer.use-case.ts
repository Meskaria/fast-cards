import { Injectable } from '@nestjs/common';
import { UseCase } from 'apps/api/src/shared/core/UseCase';
import { EventPublisher } from '@nestjs/cqrs';
import { Either, left, Result, right } from 'apps/api/src/shared/core/Result';
import { AppError } from 'apps/api/src/shared/core/AppError';
import { DeleteOfferDto } from 'apps/api/src/modules/teaching/offer/dtos/delete-offer.dto';
import { OfferRepository } from 'apps/api/src/modules/teaching/offer/repos/offer.repository';
import { DeleteOfferErrors } from 'apps/api/src/modules/teaching/offer/use-cases/delete-offer/delete-offer.errors';

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

  async execute({ id }: DeleteOfferDto): Promise<Response> {
    try {
      const offer = await this.offerRepo.getOfferByOfferId(id);

      if (!offer || offer.isDeleted) {
        return left(
          new DeleteOfferErrors.NonExistentOfferError(id)
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
