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
  Param,
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteTimeSlotDto } from 'apps/api/src/modules/teaching/time-slot/dtos/delete-time-slot.dto';
import { GetTimeSlotsByMentorIdDto } from 'apps/api/src/modules/teaching/time-slot/dtos/get-time-slots-by-mentor-id.dto';

@ApiBearerAuth()
@ApiTags('TimeSlots')
@Controller('/time-slots')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
@ApiBadRequestResponse({ description: 'Incorrect request' })
@ApiInternalServerErrorResponse()
export class TimeSlotController {
  constructor(
    private readonly createTimeSlotsUseCase: CreateTimeSlotsUseCase,
    private readonly deleteTimeSlotsUseCase: DeleteTimeSlotsUseCase,
    private readonly getTimeSlotsByRange: GetTimeSlotsByRangeUseCase,
    private readonly getTimeSlots: GetTimeSlotsUseCase
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create available time slots',
    operationId: 'create',
  })
  @ApiConflictResponse({ description: 'Time slots already exist' })
  @ApiResponse({ type: TimeSlotCollectionSerializer })
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
  @ApiOperation({ summary: 'Delete time slots', operationId: 'delete' })
  public async delete(@Body() body: DeleteTimeSlotDto, @UserData() user) {
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
  @ApiOperation({
    summary: 'Get available time slots in a given range by mentorId',
    operationId: 'getManyByRange',
  })
  @ApiParam({ name: 'mentorId', type: 'string' })
  @ApiResponse({ type: TimeSlotCollectionSerializer })
  public async timeSlotsByRange(
    @Body() body: CreateTimeSlotDto,
    @Param() { mentorId }: GetTimeSlotsByMentorIdDto
  ) {
    const timeSlotsOrError = await this.getTimeSlotsByRange.execute({
      ...body,
      mentorId,
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

  @Get(':mentorId')
  @ApiOperation({
    summary: 'Get time slots by mentorId',
    operationId: 'getMany',
  })
  @ApiParam({ name: 'mentorId', type: 'string' })
  @ApiResponse({ type: TimeSlotCollectionSerializer })
  public async timeSlotsByMentorId(
    @Param() { mentorId }: GetTimeSlotsByMentorIdDto
  ) {
    const timeSlotsOrError = await this.getTimeSlots.execute({ mentorId });

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
