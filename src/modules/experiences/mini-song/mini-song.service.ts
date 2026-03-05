import { Injectable, NotFoundException } from '@nestjs/common';
import { MiniSongRepository } from './mini-song.repository';

@Injectable()
export class MiniSongService {
  constructor(private readonly miniSongRepository: MiniSongRepository) {}
  async getMiniSongs() {
    return await this.miniSongRepository.getMiniSongs();
  }
  async getMiniSongById(mini_song_id: string) {
    const song = await this.miniSongRepository.getMiniSongById(mini_song_id);
    if (!song) {
      throw new NotFoundException(
        `Mini song with ID ${mini_song_id} not found`,
      );
    }
    return song;
  }
}
