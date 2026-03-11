export class FlexibleSlotDto {
  slot_type: string;
  start_time: string;
  duration_minutes: number;
  context: string;
  suggestions: string[];
}

export class MissedSlotResponseDto {
  slot_id: string;
  routine_id: string;
  start_time: string;
  slot_type: string;
  reason: string;
}
