import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoldenTimeRepository } from './golden-time.repository';
import { GoldenTimeSlotDto } from './dto/golden-time-slot.dto';
import { AiService } from './ai/ai.service';

@Injectable()
export class GoldenTimeService {
  constructor(
    private readonly goldenTimeRepository: GoldenTimeRepository,
    private readonly aiService: AiService,
  ) {}

  async createGoldenTimeSlot(childId: string) {
    const routineTimeBlocks =
      await this.goldenTimeRepository.findRoutineTimeBlocks(childId);

    if (routineTimeBlocks.length === 0) {
      throw new InternalServerErrorException(
        'No routine time blocks found for the child',
      );
    }

    const generatedSlots =
      await this.aiService.generateGoldenTimeSlots(routineTimeBlocks);

    return {
      routineId: routineTimeBlocks[0].routine_id,
      slots: generatedSlots,
    };
  }

  async saveGoldenTimeSlots(
    routineId: string,
    goldenTimes: GoldenTimeSlotDto[],
  ) {
    if (!goldenTimes || goldenTimes.length === 0) return [];

    return await Promise.all(
      goldenTimes.map((slot) =>
        this.goldenTimeRepository.createGoldenTimeSlot(
          routineId,
          slot.slot_type,
          slot.start_time,
          slot.duration_minutes,
          slot.context,
        ),
      ),
    );
  }
}
