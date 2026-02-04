import {
  Controller,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleDto } from './dto/schedule.dto';

@Controller('children/:childId/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async setup(@Param('childId') childId: string, @Body() dto: ScheduleDto) {
    return this.scheduleService.setupSchedule(childId, dto);
  }
}
