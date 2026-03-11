import { Injectable, NotFoundException } from '@nestjs/common';
import { FlexibleScheduleRepository } from './flexible-schedule.repository';
import { FlexibleAiService } from './ai/ai.service';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FlexibleScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repo: FlexibleScheduleRepository,
    private readonly ai: FlexibleAiService,
  ) {}

  async detectMissed(childId: string) {
    const slots = await this.repo.getActiveSlots(childId);
    const flagged = [];

    for (const slot of slots) {
      const slotAgeInDays =
        (new Date().getTime() - new Date(slot.created_at).getTime()) /
        (1000 * 3600 * 24);
      if (slotAgeInDays < 3) continue;

      let missedCount = 0;
      for (let i = 1; i <= 3; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const hasActivity = await this.repo.checkActivityOnDate(
          childId,
          slot.slot_id,
          date,
        );
        if (!hasActivity) missedCount++;
      }

      if (missedCount === 3) flagged.push(slot);
    }
    return flagged;
  }

  async reschedule(slotId: string, routineId: string) {
    const oldSlot = await this.prisma.golden_time_slots.findUnique({
      where: { slot_id: slotId },
    });
    if (!oldSlot) throw new NotFoundException('Slot not found');

    const blocks = await this.prisma.routine_time_blocks.findMany({
      where: { routine_id: routineId },
    });
    const replacement = await this.ai.generateReplacementSlot(blocks, {
      start_time: oldSlot.start_time,
      slot_type: oldSlot.slot_type,
    });

    return this.prisma.$transaction(async (tx) => {
      await this.repo.deactivateSlot(slotId, tx);
      return await this.repo.createNewSlot(
        { ...replacement, routine_id: routineId },
        tx,
      );
    });
  }
}
