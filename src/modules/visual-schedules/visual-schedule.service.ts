import { Injectable } from '@nestjs/common';
import { ScheduleRepository } from './visual-schedule.repository';

@Injectable()
export class ScheduleService {
  constructor(private readonly repo: ScheduleRepository) {}

  async getDailySchedule(userId: string) {
    const childData = await this.repo.findChildByUserId(userId);
    if (!childData) return { total_progress: 0, schedules: [] };

    const now = new Date();
    const slots = await this.repo.getActiveSlots(childData.child_id);
    const logsSummary = await this.repo.getSumSpentTimeBySlots(
      childData.child_id,
      now,
    );

    const schedules = slots.map((slot) => {
      const logEntry = logsSummary.find((l) => l.slot_id === slot.slot_id);
      const spentSeconds = logEntry?._sum?.time_spent_seconds || 0;
      const targetSeconds = slot.duration_minutes * 60;

      const percent = Math.min(
        Math.round((spentSeconds / targetSeconds) * 100),
        100,
      );

      return {
        slot_id: slot.slot_id,
        title: slot.slot_type,
        time_range: this.calculateTimeRange(
          slot.start_time,
          slot.duration_minutes,
        ),
        activity_type: slot.context || 'Learning',
        target_seconds: targetSeconds,
        spent_seconds: spentSeconds,
        progress_percent: percent,
        status: this.determineStatus(
          slot.start_time,
          slot.duration_minutes,
          percent,
          now,
        ),
        duration_label: `${slot.duration_minutes} mins`,
      };
    });

    const completedCount = schedules.filter(
      (s) => s.status === 'Completed',
    ).length;
    const totalProgress =
      slots.length > 0 ? Math.round((completedCount / slots.length) * 100) : 0;

    return { total_progress: totalProgress, schedules };
  }

  private determineStatus(
    startStr: string,
    duration: number,
    percent: number,
    now: Date,
  ): string {
    const [hours, minutes] = startStr.split(':').map(Number);
    const startTime = new Date();
    startTime.setHours(hours, minutes, 0, 0);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    if (percent >= 80) return 'Completed';
    if (now > endTime) return 'Missed';
    if (now >= startTime && now <= endTime) return 'In Progress';
    return 'Upcoming';
  }

  private calculateTimeRange(startStr: string, duration: number): string {
    const [hours, minutes] = startStr.split(':').map(Number);
    const start = new Date();
    start.setHours(hours, minutes);
    const end = new Date(start.getTime() + duration * 60000);
    const endStr = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
    return `${startStr} - ${endStr}`;
  }
}
