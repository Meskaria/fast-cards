import { Module } from '@nestjs/common';
import { OfferRepository } from './infra/repos/offer.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateOfferUseCase } from 'apps/api/src/app/modules/teaching/offer/app/use-cases/create-offer/create-offer.use-case';
import { DeleteOfferUseCase } from 'apps/api/src/app/modules/teaching/offer/app/use-cases/delete-offer/delete-offer.use-case';
import { GetAllOfferUseCase } from 'apps/api/src/app/modules/teaching/offer/app/use-cases/get-all-offer/get-all-offer.use-case';
import { OfferController } from 'apps/api/src/app/modules/teaching/offer/infra/http/offer.controller';

@Module({
  controllers: [OfferController],
  providers: [
    CreateOfferUseCase,
    DeleteOfferUseCase,
    GetAllOfferUseCase,
    OfferRepository,
  ],
  imports: [CqrsModule],
})
export class OfferModule {}
