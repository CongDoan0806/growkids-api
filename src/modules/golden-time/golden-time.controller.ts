import {
  Param,
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { GoldenTimeService } from './golden-time.service';
import { SaveGoldenTimeSlotsDto } from './dto/save-golden-time-slots.dto';
import { GoldenTimeSlotDto } from './dto/golden-time-slot.dto';
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

  @Post(':routineId')
  async addManualSlot(
    @Param('routineId') routineId: string,
    @Body() dto: GoldenTimeSlotDto,
  ) {
    return await this.goldenTimeService.createManualSlot(routineId, dto);
  }

  @Patch(':slotId')
  async updateManualSlot(
    @Param('slotId') slotId: string,
    @Body() dto: Partial<GoldenTimeSlotDto>,
  ) {
    return await this.goldenTimeService.updateManualSlot(slotId, dto);
  }
  @Delete(':slotId')
  async deleteManualSlot(@Param('slotId') slotId: string) {
    return await this.goldenTimeService.deleteManualSlot(slotId);
  }
}
