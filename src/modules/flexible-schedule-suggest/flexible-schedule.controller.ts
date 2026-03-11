import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FlexibleScheduleService } from './flexible-schedule.service';

@Controller('flexible-schedule')
export class FlexibleScheduleController {
  constructor(private readonly service: FlexibleScheduleService) {}

  @Get('check/:childId')
  async check(@Param('childId') childId: string) {
    return { success: true, data: await this.service.detectMissed(childId) };
  }

  @Post('reschedule')
  async update(@Body() body: { slotId: string; routineId: string }) {
    const result = await this.service.reschedule(body.slotId, body.routineId);
    return {
      success: true,
      message: 'AI has rescheduled successfully',
      data: result,
    };
  }
}
