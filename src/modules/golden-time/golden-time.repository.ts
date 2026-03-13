import { Injectable } from '@nestjs/common';
import { golden_time_slots, routine_time_blocks } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class GoldenTimeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveRoutineByChildId(childId: string) {
    return this.prisma.routines.findFirst({
      where: {
        child_id: childId,
        is_active: true,
      },
      select: { routine_id: true },
    });
  }

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

  async findSlotsByRoutine(routineId: string): Promise<golden_time_slots[]> {
    return this.prisma.golden_time_slots.findMany({
      where: { routine_id: routineId },
    });
  }

  async findSlotById(slotId: string): Promise<golden_time_slots | null> {
    return this.prisma.golden_time_slots.findUnique({
      where: { slot_id: slotId },
    });
  }

  async updateGoldenTimeSlot(
    slotId: string,
    data: {
      slot_type?: string;
      start_time?: string;
      duration_minutes?: number;
      context?: string;
      is_active?: boolean;
    },
  ): Promise<golden_time_slots> {
    return await this.prisma.golden_time_slots.update({
      where: { slot_id: slotId },
      data,
    });
  }

  async deleteGoldenTimeSlot(slotId: string): Promise<golden_time_slots> {
    return await this.prisma.golden_time_slots.delete({
      where: { slot_id: slotId },
    });
  }
}
