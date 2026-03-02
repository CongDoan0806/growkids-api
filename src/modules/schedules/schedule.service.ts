import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ScheduleRepository } from './schedule.repository';
import { ScheduleDto, TimeBlockDto } from './dto/schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    private prisma: PrismaService,
    private scheduleRepository: ScheduleRepository,
  ) {}

  async getScheduleStatus(userId: string) {
    const child = await this.scheduleRepository.findChildByUserId(userId);

    if (!child || child.length === 0) return { hasSchedule: false };
    const childId = child[0].child_id;

    const existedRoutine =
      await this.scheduleRepository.findActiveRoutine(childId);
    return { hasSchedule: !!existedRoutine };
  }

  async setupSchedule(userId: string, dto: ScheduleDto) {
    this.validateTimeBlocks(dto.time_blocks);

    const children = await this.scheduleRepository.findChildByUserId(userId);
    if (!children?.length) throw new NotFoundException('Child does not exist.');

    const childId = children[0].child_id;

    const existed = await this.scheduleRepository.findActiveRoutine(childId);
    if (existed) throw new BadRequestException('Child already has a schedule');

    return this.prisma.$transaction(async (tx) => {
      const routine = await this.scheduleRepository.createRoutine(tx, {
        child_id: childId,
        routine_name: 'AI Conversation Schedule',
        is_active: true,
        created_by_ai: true,
        updated_at: new Date(),
      });

      const blocksData = dto.time_blocks.map((block) => ({
        ...block,
        routine_id: routine.routine_id,
      }));

      await this.scheduleRepository.createBlocks(tx, blocksData);

      return {
        message: 'Schedule saved successfully',
        data: routine,
      };
    });
  }

  private validateTimeBlocks(time_blocks: TimeBlockDto[]) {
    for (const block of time_blocks) {
      if (block.start_time >= block.end_time) {
        throw new BadRequestException(
          `The activity ${block.activity_type} has a start time later than its end time`,
        );
      }
    }
  }
}
