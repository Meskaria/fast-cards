import { IsDate, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateAssignableToSlot } from 'apps/api/src/app/modules/teaching/time-slot/infra/http/validator/is-date-assignable-to-slot';

export class CreateTimeSlotDto {
  @ApiProperty()
  @Type(() => SlotDto)
  @ValidateNested({ each: true })
  slots: SlotDto[];
}

export class SlotDto {
  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  @IsDateAssignableToSlot()
  since: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @IsDateAssignableToSlot()
  till: Date;
}
