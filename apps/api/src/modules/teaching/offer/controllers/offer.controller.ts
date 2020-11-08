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
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UserData } from 'apps/api/src/modules/user/services/auth/user-info.decorator';
import { User } from 'apps/api/src/modules/user/domain/model/user';
import {
  CreateOfferUseCase,
  CreateOfferErrors,
  GetAllOfferUseCase,
  GetAllOfferErrors,
  DeleteOfferUseCase,
  DeleteOfferErrors,
} from 'apps/api/src/modules/teaching/offer/use-cases';
import {
  CreateOfferDto,
  GetAllOfferDto,
  DeleteOfferDto,
} from 'apps/api/src/modules/teaching/offer/dtos';
import { OfferMap } from 'apps/api/src/modules/teaching/offer/mappers/offer.map';
import { OfferSerializer } from 'apps/api/src/modules/teaching/offer/serializers/offer.serializer';

@ApiTags('Offer')
@ApiBearerAuth()
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
  @ApiOperation({
    summary: 'List all offers for a given mentorId',
    operationId: 'getAll',
  })
  @ApiParam({ type: 'string', name: 'mentorId' })
  @ApiNotFoundResponse({ description: 'No offers found for a given mentorId' })
  @ApiResponse({ status: HttpStatus.OK, type: [OfferSerializer] })
  public async getAll(@Param() { mentorId }: GetAllOfferDto) {
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
  @ApiOperation({
    summary: 'Create an offer for a logged in mentor',
    operationId: 'create',
  })
  @ApiConflictResponse({ description: ' Offer already exists' })
  @ApiResponse({ status: HttpStatus.OK, type: OfferSerializer })
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
      return new OfferSerializer(offerDto);
    }
  }

  @Delete()
  @ApiOperation({
    summary: 'Create an offer for a logged in mentor',
    operationId: 'delete',
  })
  @ApiParam({ type: 'string', name: 'mentorId' })
  @ApiConflictResponse({ description: 'Offer not found' })
  @ApiResponse({ status: HttpStatus.OK, type: OfferSerializer })
  public async delete(@Param() { offerId }: DeleteOfferDto) {
    const result = await this.deleteOfferUseCase.execute({ offerId });

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
