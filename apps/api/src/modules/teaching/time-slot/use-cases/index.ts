import { GetTimeSlotsUseCase } from '@app/modules/teaching/time-slot/use-cases/get-time-slots/get-time-slots.use-case';
import { DeleteTimeSlotsUseCase } from '@app/modules/teaching/time-slot/use-cases/delete-time-slots/delete-time-slots.use-case';
import { GetTimeSlotsByRangeUseCase } from '@app/modules/teaching/time-slot/use-cases/get-time-slots-by-range/get-time-slots-by-range.use-case';
import { CreateTimeSlotsUseCase } from '@app/modules/teaching/time-slot/use-cases/create-time-slots/create-time-slots.use-case';

export default [
  GetTimeSlotsUseCase,
  DeleteTimeSlotsUseCase,
  CreateTimeSlotsUseCase,
  GetTimeSlotsByRangeUseCase,
];
