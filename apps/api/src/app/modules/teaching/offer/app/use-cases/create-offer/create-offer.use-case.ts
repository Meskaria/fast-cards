import { Injectable } from '@nestjs/common';
import { UseCase } from 'apps/api/src/app/shared/core/UseCase';
import {
  Either,
  left,
  Result,
  right,
} from 'apps/api/src/app/shared/core/Result';
import { AppError } from 'apps/api/src/app/shared/core/AppError';
import { UniqueEntityID } from 'apps/api/src/app/shared/domain/UniqueEntityID';
import { EventPublisher } from '@nestjs/cqrs';
import { CreateOfferWithMentorIdDto } from 'apps/api/src/app/modules/teaching/offer/infra/http/dtos/create-offer.dto';
import { OfferRepository } from 'apps/api/src/app/modules/teaching/offer/infra/repos/offer.repository';
import { Offer } from 'apps/api/src/app/modules/teaching/offer/domain/model/offer';
import { CreateOfferErrors } from 'apps/api/src/app/modules/teaching/offer/app/use-cases/create-offer/create-offer.errors';

export type Response = Either<
  CreateOfferErrors.OfferAlreadyExistsError | AppError.UnexpectedError,
  Result<Offer>
>;

@Injectable()
export class CreateOfferUseCase
  implements UseCase<CreateOfferWithMentorIdDto, Promise<Response>> {
  constructor(
    private offerRepo: OfferRepository,
    private publisher: EventPublisher
  ) {}

  async execute(offerData: CreateOfferWithMentorIdDto): Promise<Response> {
    const dtoResult = Result.combine([]);

    if (dtoResult.isFailure) {
      return left(Result.fail<void>(dtoResult.error)) as Response;
    }

    try {
      const nextOfferId = this.offerRepo.nextId();
      const offerOrError: Result<Offer> = Offer.create(
        offerData,
        new UniqueEntityID(nextOfferId)
      );

      if (offerOrError.isFailure) {
        return left(
          Result.fail<Offer>(offerOrError.error.toString())
        ) as Response;
      }

      const offer: Offer = offerOrError.getValue();
      await this.offerRepo.save(offer);

      const savedOffer = this.publisher.mergeObjectContext(offer);

      savedOffer.commit();

      return right(Result.ok<Offer>(savedOffer));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
