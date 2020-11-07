import { GetTimeSlotsUseCase } from './get-time-slots/get-time-slots.use-case';
import { DeleteTimeSlotsUseCase } from './delete-time-slots/delete-time-slots.use-case';
import { GetTimeSlotsByRangeUseCase } from './get-time-slots-by-range/get-time-slots-by-range.use-case';
import { CreateTimeSlotsUseCase } from './create-time-slots/create-time-slots.use-case';

export default [
  GetTimeSlotsUseCase,
  DeleteTimeSlotsUseCase,
  CreateTimeSlotsUseCase,
  GetTimeSlotsByRangeUseCase,
];
