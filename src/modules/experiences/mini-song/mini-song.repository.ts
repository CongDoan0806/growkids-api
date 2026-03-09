import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class MiniSongRepository {
  constructor(private prisma: PrismaService) {}

  async getMiniSongs() {
    return await this.prisma.mini_songs.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async getTodayLearningLogs(childId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.prisma.learning_logs.findMany({
      where: {
        child_id: childId,
        started_at: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
  }

  async getMiniSongById(mini_song_id: string) {
    return await this.prisma.mini_songs.findUnique({
      where: { mini_song_id },
      include: {
        song_lyrics: {
          orderBy: {
            line_order: 'asc',
          },
        },
      },
    });
  }

  async increaseViewCount(mini_song_id: string) {
    return await this.prisma.mini_songs.update({
      where: { mini_song_id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  async getCurrentGoldenTimeSlot(childId: string) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const routine = await this.prisma.routines.findFirst({
      where: {
        child_id: childId,
        is_active: true,
      },
      include: {
        golden_time_slots: {
          where: { is_active: true },
        },
      },
    });

    if (!routine) return null;

    return routine.golden_time_slots.find((slot) => {
      const [startHour, startMin] = slot.start_time.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = startMinutes + slot.duration_minutes;
      const [currentHour, currentMin] = currentTime.split(':').map(Number);
      const currentMinutes = currentHour * 60 + currentMin;

      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    });
  }

  async createLearningLog(
    childId: string,
    miniSongId: string,
    slotId?: string,
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingLog = await this.prisma.learning_logs.findFirst({
      where: {
        child_id: childId,
        mini_song_id: miniSongId,
        started_at: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (existingLog) {
      return existingLog;
    }

    return await this.prisma.learning_logs.create({
      data: {
        child_id: childId,
        mini_song_id: miniSongId,
        slot_id: slotId,
      },
    });
  }

  async updateLearningLog(
    logId: number,
    time_spent_seconds: number,
    last_position_seconds: number,
    isCompleted: boolean,
  ) {
    const currentLog = await this.prisma.learning_logs.findUnique({
      where: { learning_log_id: logId },
    });

    if (currentLog?.is_completed) {
      return await this.prisma.learning_logs.update({
        where: { learning_log_id: logId },
        data: { time_spent_seconds },
      });
    }

    return await this.prisma.learning_logs.update({
      where: { learning_log_id: logId },
      data: {
        time_spent_seconds,
        last_position_seconds,
        is_completed: isCompleted,
      },
    });
  }

  async markSongAsCompleted(logId: number) {
    return await this.prisma.learning_logs.update({
      where: { learning_log_id: logId },
      data: { is_completed: true },
    });
  }
}
