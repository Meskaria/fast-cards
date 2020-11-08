import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
  Post,
  Get,
  Body,
  ConflictException,
  InternalServerErrorException,
  UseGuards,
  Delete,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserData } from 'apps/api/src/modules/user/services/auth/user-info.decorator';
import { User } from 'apps/api/src/modules/user/domain/model/user';
import { CreateOfferUseCase } from 'apps/api/src/modules/teaching/offer/use-cases/create-offer/create-offer.use-case';
import { CreateOfferDto } from 'apps/api/src/modules/teaching/offer/dtos/create-offer.dto';
import { OfferMap } from 'apps/api/src/modules/teaching/offer/mappers/offer.map';
import { OfferSerializer } from 'apps/api/src/modules/teaching/offer/serializers/offer.serializer';
import { DeleteOfferDto } from 'apps/api/src/modules/teaching/offer/dtos/delete-offer.dto';
import { DeleteOfferUseCase } from 'apps/api/src/modules/teaching/offer/use-cases/delete-offer/delete-offer.use-case';
import { GetAllOfferUseCase } from 'apps/api/src/modules/teaching/offer/use-cases/get-all-offer/get-all-offer.use-case';
import { DeleteOfferErrors } from 'apps/api/src/modules/teaching/offer/use-cases/delete-offer/delete-offer.errors';
import { GetAllOfferErrors } from 'apps/api/src/modules/teaching/offer/use-cases/get-all-offer/get-all-offer.errors';
import { CreateOfferErrors } from 'apps/api/src/modules/teaching/offer/use-cases/create-offer/create-offer.errors';

@Controller('offer')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
export class OfferController {
  constructor(
    private createOfferUseCase: CreateOfferUseCase,
    private deleteOfferUseCase: DeleteOfferUseCase,
    private getAllOfferUseCase: GetAllOfferUseCase
  ) {}

  @Get()
  public async getAll(@Param('mentorId') mentorId: string) {
    const result = await this.getAllOfferUseCase.execute({ mentorId });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case GetAllOfferErrors.NoOffersForGivenMentorId:
          throw new NotFoundException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else {
      const offers = result.value.getValue();
      const offersDto = await Promise.all(
        offers.map(async (offer) => await OfferMap.toDTO(offer))
      );
      return offersDto.map((offer) => new OfferSerializer(offer));
    }
  }

  @Post()
  public async create(
    @Body() body: CreateOfferDto,
    @UserData() { mentorId }: User
  ) {
    const result = await this.createOfferUseCase.execute({ ...body, mentorId });
    if (result.isLeft()) {
      const error = result.value;
      switch (error.constructor) {
        case CreateOfferErrors.OfferAlreadyExistsError:
          throw new ConflictException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else {
      const offer = result.value.getValue();
      const offerDto = await OfferMap.toDTO(offer);
      console.log('DTO', offerDto);
      return new OfferSerializer(offerDto);
    }
  }

  @Delete()
  public async deleteOne(@Body() { id }: DeleteOfferDto) {
    const result = await this.deleteOfferUseCase.execute({ id });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case DeleteOfferErrors.NonExistentOfferError:
          throw new NotFoundException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    }
    return;
  }
}
