import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ScheduleRepository {
  constructor(private prisma: PrismaService) {}

  async findChildByUserId(user_id: string) {
    return this.prisma.children.findFirst({
      where: { user_id },
      select: { child_id: true },
    });
  }

  async getActiveSlots(childId: string) {
    return this.prisma.golden_time_slots.findMany({
      where: {
        is_active: true,
        routines: { child_id: childId },
      },
      orderBy: { start_time: 'asc' },
    });
  }

  async getSumSpentTimeForAllSlots(childId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.learning_logs.groupBy({
      by: ['slot_id'],
      where: {
        child_id: childId,
        started_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      _sum: {
        time_spent_seconds: true,
      },
    });
  }
}
