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

  private timeToMinutes(time: string): number {
    if (!time) {
      throw new Error('Time string is required');
    }
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  private checkOverlap(
    s1: string,
    d1: number,
    s2: string,
    d2: number,
  ): boolean {
    const start1 = this.timeToMinutes(s1);
    const end1 = start1 + d1;
    const start2 = this.timeToMinutes(s2);
    const end2 = start2 + d2;
    return start1 < end2 && start2 < end1;
  }

  async createManualSlot(routineId: string, dto: GoldenTimeSlotDto) {
    const existingSlots =
      await this.goldenTimeRepository.findSlotsByRoutine(routineId);

    for (const slot of existingSlots) {
      if (slot.is_active !== false) {
        if (
          this.checkOverlap(
            dto.start_time,
            dto.duration_minutes,
            slot.start_time,
            slot.duration_minutes,
          )
        ) {
          throw new InternalServerErrorException(
            'New slot overlaps with existing slot',
          );
        }
      }
    }

    return await this.goldenTimeRepository.createGoldenTimeSlot(
      routineId,
      dto.slot_type,
      dto.start_time,
      dto.duration_minutes,
      dto.context,
    );
  }

  async updateManualSlot(slotId: string, dto: Partial<GoldenTimeSlotDto>) {
    const current = await this.goldenTimeRepository.findSlotById(slotId);
    if (!current) throw new InternalServerErrorException('Slot not found');

    if (dto.start_time || dto.duration_minutes) {
      const allSlots = await this.goldenTimeRepository.findSlotsByRoutine(
        current.routine_id,
      );
      const newStart = dto.start_time || current.start_time;
      const newDur = dto.duration_minutes || current.duration_minutes;

      for (const slot of allSlots) {
        if (slot.slot_id !== slotId && slot.is_active !== false) {
          if (
            this.checkOverlap(
              newStart,
              newDur,
              slot.start_time,
              slot.duration_minutes,
            )
          ) {
            throw new InternalServerErrorException(
              'Updated slot overlaps with existing slot',
            );
          }
        }
      }
    }

    return await this.goldenTimeRepository.updateGoldenTimeSlot(slotId, dto);
  }

  async deleteManualSlot(slotId: string) {
    const slot = await this.goldenTimeRepository.findSlotById(slotId);
    if (!slot) throw new InternalServerErrorException('Slot not found');
    return await this.goldenTimeRepository.deleteGoldenTimeSlot(slotId);
  }
}
