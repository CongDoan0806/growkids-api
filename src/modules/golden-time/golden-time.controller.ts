import { Param, Controller, Post, Body, Get } from '@nestjs/common';
import { GoldenTimeService } from './golden-time.service';
import { SaveGoldenTimeSlotsDto } from './dto/save-golden-time-slots.dto';
@Controller('golden-time')
export class GoldenTimeController {
  constructor(private readonly goldenTimeService: GoldenTimeService) {}
  @Get(':childId')
  async generateGoldenTimeSlots(@Param('childId') childId: string) {
    return await this.goldenTimeService.createGoldenTimeSlot(childId);
  }
  @Post()
  async saveGoldenTime(@Body() dto: SaveGoldenTimeSlotsDto) {
    return await this.goldenTimeService.saveGoldenTimeSlots(
      dto.routineId,
      dto.slots,
    );
  }
}
