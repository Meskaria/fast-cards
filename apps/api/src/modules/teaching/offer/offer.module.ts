import { Module } from '@nestjs/common';
import { OfferRepository } from 'apps/api/src/modules/teaching/offer/repos/offer.repository';
import { CqrsModule } from '@nestjs/cqrs';
import UseCases from 'apps/api/src/modules/teaching/offer/use-cases';
import { OfferController } from 'apps/api/src/modules/teaching/offer/controllers/offer.controller';

@Module({
  controllers: [OfferController],
  providers: [OfferRepository, ...UseCases],
  imports: [CqrsModule],
})
export class OfferModule {}
