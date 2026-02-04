// src/modules/schedules/schedule.repository.ts
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { ScheduleDto } from './dto/schedule.dto';

@Injectable()
export class ScheduleRepository {
  constructor(private prisma: PrismaService) {}

  async saveFullSchedule(dto: ScheduleDto) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const routine = await tx.routines.create({
        data: {
          child_id: dto.child_id,
          routine_name: 'AI Conversation Schedule',
          is_active: true,
        },
      });

      const blocks = dto.time_blocks.map((block) => ({
        ...block,
        routine_id: routine.routine_id,
      }));

      await tx.routine_time_blocks.createMany({ data: blocks });

      return routine;
    });
  }
}
