import { Injectable } from '@nestjs/common';
import { UseCase } from 'apps/api/src/shared/core/UseCase';
import { Either, left, Result, right } from 'apps/api/src/shared/core/Result';
import { AppError } from 'apps/api/src/shared/core/AppError';
import { UniqueEntityID } from 'apps/api/src/shared/domain/UniqueEntityID';
import { EventPublisher } from '@nestjs/cqrs';
import { CreateOfferWithMentorIdDto } from 'apps/api/src/modules/teaching/offer/dtos/create-offer.dto';
import { OfferRepository } from 'apps/api/src/modules/teaching/offer/repos/offer.repository';
import { Offer } from 'apps/api/src/modules/teaching/offer/domain/model/offer';
import { CreateOfferErrors } from 'apps/api/src/modules/teaching/offer/use-cases/create-offer/create-offer.errors';

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

      this.publisher.mergeObjectContext(offer).commit();

      return right(Result.ok<Offer>(offer));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
