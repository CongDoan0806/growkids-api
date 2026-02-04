import { BadRequestException, Injectable } from '@nestjs/common';
import { ScheduleRepository } from './schedule.repository';
import { ScheduleDto, TimeBlockDto } from './dto/schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private scheduleRepository: ScheduleRepository) {}

  async setupSchedule(childId: string, dto: ScheduleDto) {
    this.validateTimeBlocks(dto.time_blocks);

    const routine = await this.scheduleRepository.saveFullSchedule(
      childId,
      dto,
    );

    return {
      message: 'Schedule saved successfully',
      data: routine,
    };
  }

  private validateTimeBlocks(time_blocks: TimeBlockDto[]) {
    for (const block of time_blocks) {
      if (block.start_time >= block.end_time) {
        throw new BadRequestException(
          `Hoạt động ${block.activity_type} có thời gian bắt đầu muộn hơn thời gian kết thúc.`,
        );
      }
    }
  }
}
