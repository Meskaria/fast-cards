import { IsDate, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateAssignableToSlot } from '@app/modules/teaching/time-slot/validator/is-date-assignable-to-slot';

export class SlotDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @IsDateAssignableToSlot()
  since: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @IsDateAssignableToSlot()
  till: Date;
}

export class CreateTimeSlotDto {
  @ApiProperty({ type: SlotDto })
  @Type(() => SlotDto)
  @ValidateNested({ each: true })
  slots: SlotDto[];
}
