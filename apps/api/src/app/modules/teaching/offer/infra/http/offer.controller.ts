import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
  Post,
  Body,
  ConflictException,
  InternalServerErrorException,
  UseGuards, Delete, NotFoundException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserData } from 'apps/api/src/app/modules/user/infra/services/auth/user-info.decorator';
import { User } from 'apps/api/src/app/modules/user/domain/model/user';
import { CreateOfferUseCase } from 'apps/api/src/app/modules/teaching/offer/app/use-cases/create-offer/create-offer.use-case';
import { CreateOfferDto } from 'apps/api/src/app/modules/teaching/offer/infra/http/dtos/create-offer.dto';
import { CreateOfferErrors } from 'apps/api/src/app/modules/teaching/offer/app/use-cases/create-offer/create-offer.errors';
import { OfferMap } from 'apps/api/src/app/modules/teaching/offer/infra/mappers/offer.map';
import { OfferSerializer } from 'apps/api/src/app/modules/teaching/offer/infra/http/serializers/offer.serializer';
import { DeleteOfferDto } from 'apps/api/src/app/modules/teaching/offer/infra/http/dtos/delete-offer.dto';
import { DeleteOfferUseCase } from 'apps/api/src/app/modules/teaching/offer/app/use-cases/delete-offer/delete-offer.use-case';
import { DeleteOfferErrors } from 'apps/api/src/app/modules/teaching/offer/app/use-cases/delete-offer/delete-offer.errors';

@Controller('offer')
@UseInterceptors(ClassSerializerInterceptor)
export class OfferController {
  constructor(private createOfferUseCase: CreateOfferUseCase, private deleteOfferUseCase: DeleteOfferUseCase) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  public async create(@Body() body: CreateOfferDto, @UserData() user: User) {
    const mentorId = user.mentorId;
    const result = await this.createOfferUseCase.execute({ ...body, mentorId });
    if (result.isLeft()) {
      const error = result.value;
      console.log('ERR', error.constructor);
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
  @UseGuards(AuthGuard('jwt'))
  public async deleteOne(@Body() {id}: DeleteOfferDto) {
    console.log('id', id);
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
