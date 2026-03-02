import { Injectable } from '@nestjs/common';
import { golden_time_slots, routine_time_blocks } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class GoldenTimeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRoutineTimeBlocks(childId: string): Promise<routine_time_blocks[]> {
    return this.prisma.routine_time_blocks.findMany({
      where: {
        routines: {
          child_id: childId,
        },
      },
    });
  }
  async createGoldenTimeSlot(
    routineId: string,
    slotType: string,
    startTime: string,
    durationMinutes: number,
    context?: string,
  ): Promise<golden_time_slots> {
    return await this.prisma.golden_time_slots.create({
      data: {
        routine_id: routineId,
        slot_type: slotType,
        start_time: startTime,
        duration_minutes: durationMinutes,
        context,
      } as any,
    });
  }
}
