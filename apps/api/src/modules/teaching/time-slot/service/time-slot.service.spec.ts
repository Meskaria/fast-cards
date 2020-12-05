import { Test, TestingModule } from '@nestjs/testing';
import { TimeSlotService } from '@app/modules/teaching/time-slot/service/time-slot.service';
import { SlotDto } from '@app/modules/teaching/time-slot/dtos/create-time-slot.dto';

describe('TimeSlotService', () => {
  let service: TimeSlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeSlotService],
    }).compile();

    service = module.get<TimeSlotService>(TimeSlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('calculateSlots', () => {
    it('should return the array of slots', () => {
      const slots: SlotDto[] = [
        {
          since: new Date('2020-10-18T12:30:00.000Z'),
          till: new Date('2020-10-18T13:30:00.000Z'),
        },
        {
          since: new Date('2020-10-18T15:30:00.000Z'),
          till: new Date('2020-10-18T17:30:00.000Z'),
        },
      ];

      const calculatedSlots = service.calculateRange(slots);

      expect(calculatedSlots.length).toBe(12);
      expect(calculatedSlots[0].start).toBe('2020-10-18T12:30:00.000Z');
      expect(calculatedSlots[0].end).toBe('2020-10-18T12:45:00.000Z');
    });
  });

  it('should throw when since is later then till', () => {});
  it('should handle dates that cover multiple days', () => {});
});
