import { IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GoldenTimeSlotDto } from './golden-time-slot.dto';

export class SaveGoldenTimeSlotsDto {
  @IsUUID()
  routineId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveGoldenTimeSlotsDto)
  slots: GoldenTimeSlotDto[];
}
