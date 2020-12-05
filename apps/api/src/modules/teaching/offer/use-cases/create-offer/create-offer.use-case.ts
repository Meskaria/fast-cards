import { Injectable } from '@nestjs/common';
import { UseCase } from '@app/shared/core/UseCase';
import { Either, left, Result, right } from '@app/shared/core/Result';
import { AppError } from '@app/shared/core/AppError';
import { UniqueEntityID } from '@app/shared/domain/UniqueEntityID';
import { EventPublisher } from '@nestjs/cqrs';
import { OfferRepository } from '@app/modules/teaching/offer/repos/offer.repository';
import { Offer } from '@app/modules/teaching/offer/domain/model/offer';
import { CreateOfferErrors } from '@app/modules/teaching/offer/use-cases/create-offer/create-offer.errors';
import { CreateOfferWithMentorIdDto } from '@app/modules/teaching/offer/use-cases/create-offer/create-offer.dto';

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
          Result.fail<Offer>(offerOrError.errorValue().toString())
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
