import { Injectable, NotFoundException } from '@nestjs/common';
import { MiniSongRepository } from './mini-song.repository';

@Injectable()
export class MiniSongService {
  constructor(private readonly miniSongRepository: MiniSongRepository) {}

  async getMiniSongs(childId: string) {
    const songs = await this.miniSongRepository.getMiniSongs();
    const todayLogs =
      await this.miniSongRepository.getTodayLearningLogs(childId);

    return songs.map((song) => {
      const log = todayLogs.find((l) => l.mini_song_id === song.mini_song_id);
      return {
        ...song,
        learningLog: log || null,
      };
    });
  }

  async getMiniSongById(mini_song_id: string, childId: string) {
    const song = await this.miniSongRepository.getMiniSongById(mini_song_id);
    if (!song) {
      throw new NotFoundException(
        `Mini song with ID ${mini_song_id} not found`,
      );
    }

    const currentSlot =
      await this.miniSongRepository.getCurrentGoldenTimeSlot(childId);

    const learningLog = await this.miniSongRepository.createLearningLog(
      childId,
      mini_song_id,
      currentSlot?.slot_id,
    );

    await this.miniSongRepository.increaseViewCount(mini_song_id);

    return {
      ...song,
      learningLogId: learningLog.learning_log_id,
      currentGoldenTimeSlot: currentSlot,
    };
  }

  async updateLearningLog(
    logId: number,
    time_spent_seconds: number,
    last_position_seconds: number,
    isCompleted: boolean,
  ) {
    return await this.miniSongRepository.updateLearningLog(
      logId,
      time_spent_seconds,
      last_position_seconds,
      isCompleted,
    );
  }
}
