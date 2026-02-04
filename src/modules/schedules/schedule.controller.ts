import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleDto } from './dto/schedule.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('setup')
  @UsePipes(new ValidationPipe({ transform: true }))
  async setup(@Body() createScheduleDto: ScheduleDto) {
    return this.scheduleService.setupSchedule(createScheduleDto);
  }
}
