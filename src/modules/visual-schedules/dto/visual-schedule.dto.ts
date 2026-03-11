export class ScheduleItemDto {
  slot_id: string;
  title: string;
  time_range: string;
  activity_type: string;
  target_seconds: number;
  spent_seconds: number;
  progress_percent: number;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Missed';
  duration_label: string;
}

export class DailyScheduleResponseDto {
  total_progress: number;
  schedules: ScheduleItemDto[];
}
