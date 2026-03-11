import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ScheduleService } from './visual-schedule.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('daily')
  async getDailySchedule(@Req() req) {
    const userId = req.user.id || req.user.sub || req.user.userId;

    if (!userId) {
      console.error('No User IDs could be found in the Tokens!');
    }

    return await this.scheduleService.getDailySchedule(userId);
  }
}
