import { Injectable } from '@nestjs/common';
import { UseCase } from '@app/shared/core/UseCase';
import { EventPublisher } from '@nestjs/cqrs';
import { Either, left, Result, right } from '@app/shared/core/Result';
import { AppError } from '@app/shared/core/AppError';
import { OfferRepository } from '@app/modules/teaching/offer/repos/offer.repository';
import { DeleteOfferErrors } from '@app/modules/teaching/offer/use-cases/delete-offer/delete-offer.errors';
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
      const result = await this.offerRepo.getOfferByOfferId(offerId);
      if(result.isFailure){
        return left(new DeleteOfferErrors.NonExistentOfferError(offerId)) as Response;
      }
      const offer = result.getValue()

      offer.delete();
      await this.offerRepo.save(offer);

      this.publisher.mergeObjectContext(offer).commit();

      return right(Result.ok<void>());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
