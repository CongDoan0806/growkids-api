import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScheduleRepository {
  constructor(private readonly prisma: PrismaService) {}

  findChildByUserId(user_id: string) {
    return this.prisma.children.findMany({
      where: { user_id },
      select: { child_id: true, full_name: true },
    });
  }

  findActiveRoutine(child_id: string) {
    return this.prisma.routines.findFirst({
      where: { child_id, is_active: true },
    });
  }

  createRoutine(
    tx: Prisma.TransactionClient,
    data: Prisma.routinesUncheckedCreateInput,
  ) {
    return tx.routines.create({ data });
  }

  createBlocks(
    tx: Prisma.TransactionClient,
    data: Prisma.routine_time_blocksCreateManyInput[],
  ) {
    return tx.routine_time_blocks.createMany({ data });
  }
}
