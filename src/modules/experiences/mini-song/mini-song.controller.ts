import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { MiniSongService } from './mini-song.service';

@UseGuards(JwtAuthGuard)
@Controller('mini-songs')
export class MiniSongController {
  constructor(private readonly miniSongService: MiniSongService) {}
  @Get()
  async getMiniSongs(@Query('childId') childId: string) {
    return await this.miniSongService.getMiniSongs(childId);
  }

  @Get(':mini_song_id')
  async getMiniSongById(
    @Param('mini_song_id') mini_song_id: string,
    @Query('childId') childId: string,
  ) {
    return await this.miniSongService.getMiniSongById(mini_song_id, childId);
  }

  @Patch('learning-log/:logId')
  async updateLearningLog(
    @Param('logId') logId: string,
    @Body()
    body: {
      time_spent_seconds: number;
      last_position_seconds: number;
      isCompleted: boolean;
    },
  ) {
    const { time_spent_seconds, last_position_seconds, isCompleted } = body;
    return await this.miniSongService.updateLearningLog(
      +logId,
      time_spent_seconds,
      last_position_seconds,
      isCompleted,
    );
  }
}
