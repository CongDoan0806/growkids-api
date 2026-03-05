import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { MiniSongService } from './mini-song.service';

@UseGuards(JwtAuthGuard)
@Controller('mini-songs')
export class MiniSongController {
  constructor(private readonly miniSongService: MiniSongService) {}
  @Get()
  async getMiniSongs() {
    return await this.miniSongService.getMiniSongs();
  }

  @Get(':mini_song_id')
  async getMiniSongById(@Param('mini_song_id') mini_song_id: string) {
    return await this.miniSongService.getMiniSongById(mini_song_id);
  }
}
