import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  UseInterceptors,
  UseGuards,
  Delete,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTimeSlotsUseCase } from 'apps/api/src/modules/teaching/time-slot/use-cases/create-time-slots/create-time-slots.use-case';
import { CreateTimeSlotDto } from 'apps/api/src/modules/teaching/time-slot/dtos/create-time-slot.dto';
import { TimeSlotMap } from 'apps/api/src/modules/teaching/time-slot/mappers/time-slot.map';
import { TimeSlotCollectionSerializer } from 'apps/api/src/modules/teaching/time-slot/serializers/time-slot.serializer';
import { UserData } from 'apps/api/src/modules/user/services/auth/user-info.decorator';
import { DeleteTimeSlotsUseCase } from 'apps/api/src/modules/teaching/time-slot/use-cases/delete-time-slots/delete-time-slots.use-case';
import { CreateTimeSlotsErrors } from 'apps/api/src/modules/teaching/time-slot/use-cases/create-time-slots/create-time-slots.errors';
import { DeleteTimeSlotsErrors } from 'apps/api/src/modules/teaching/time-slot/use-cases/delete-time-slots/delete-time-slots.errors';
import { GetTimeSlotsByRangeUseCase } from 'apps/api/src/modules/teaching/time-slot/use-cases/get-time-slots-by-range/get-time-slots-by-range.use-case';
import { GetTimeSlotsUseCase } from 'apps/api/src/modules/teaching/time-slot/use-cases/get-time-slots/get-time-slots.use-case';

@Controller('/user/time-slots')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
export class TimeSlotController {
  constructor(
    private readonly createTimeSlotsUseCase: CreateTimeSlotsUseCase,
    private readonly deleteTimeSlotsUseCase: DeleteTimeSlotsUseCase,
    private readonly getTimeSlotsByRange: GetTimeSlotsByRangeUseCase,
    private readonly getTimeSlots: GetTimeSlotsUseCase
  ) {}

  @Post()
  public async create(@Body() body: CreateTimeSlotDto, @UserData() user) {
    const result = await this.createTimeSlotsUseCase.execute({
      ...body,
      mentorId: user.mentorId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CreateTimeSlotsErrors.TimeSlotAlreadyExistsError:
          throw new ConflictException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else {
      const timeSlots = result.value.getValue();
      const timeSlotsDto = TimeSlotMap.toDTOBulk(timeSlots);
      return new TimeSlotCollectionSerializer(timeSlotsDto);
    }
  }

  @Delete()
  public async delete(@Body() body: CreateTimeSlotDto, @UserData() user) {
    const result = await this.deleteTimeSlotsUseCase.execute({
      ...body,
      mentorId: user.mentorId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case DeleteTimeSlotsErrors.TimeSlotsDoesNotExistsError:
          throw new BadRequestException(error.errorValue().message);
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else {
      return;
    }
  }

  @Get('range')
  public async timeSlotsByRange(
    @Body() body: CreateTimeSlotDto,
    @UserData() user
  ) {
    const timeSlotsOrError = await this.getTimeSlotsByRange.execute({
      ...body,
      mentorId: user.mentorId,
    });

    if (timeSlotsOrError.isLeft()) {
      const error = timeSlotsOrError.value;

      switch (error.constructor) {
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else {
      const timeSlots = timeSlotsOrError.value.getValue();
      const timeSlotsDto = TimeSlotMap.toDTOBulk(timeSlots);
      return new TimeSlotCollectionSerializer(timeSlotsDto);
    }
  }

  @Get()
  public async timeSlots(@Body() body: CreateTimeSlotDto, @UserData() user) {
    const timeSlotsOrError = await this.getTimeSlots.execute(user.mentorId);

    if (timeSlotsOrError.isLeft()) {
      const error = timeSlotsOrError.value;

      switch (error.constructor) {
        default:
          throw new InternalServerErrorException(error.errorValue().message);
      }
    } else {
      const timeSlots = timeSlotsOrError.value.getValue();
      const timeSlotsDto = TimeSlotMap.toDTOBulk(timeSlots);
      return new TimeSlotCollectionSerializer(timeSlotsDto);
    }
  }
}
