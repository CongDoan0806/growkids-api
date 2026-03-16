import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FlexibleScheduleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveSlots(childId: string) {
    return await this.prisma.golden_time_slots.findMany({
      where: { routine: { child_id: childId }, is_active: true },
    });
  }

  async checkActivityOnDate(childId: string, slotId: string, date: Date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const log = await this.prisma.learning_logs.findFirst({
      where: {
        child_id: childId,
        slot_id: slotId,
        started_at: { gte: start, lte: end },
        time_spent_seconds: { gt: 0 },
      },
    });
    return !!log;
  }

  async deactivateSlot(slotId: string, tx: any) {
    return await tx.golden_time_slots.update({
      where: { slot_id: slotId },
      data: { is_active: false },
    });
  }

  async createNewSlot(data: any, tx: any) {
    return await tx.golden_time_slots.create({
      data: { ...data, is_active: true },
    });
  }
}
