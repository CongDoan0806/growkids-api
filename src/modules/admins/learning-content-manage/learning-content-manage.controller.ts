import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AdminMiniSongService } from './learning-content-manage.service';
import {
  AdminFetchYoutubeDto,
  AdminCreateFullSongDto,
} from './dto/admin-minisong.dto';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';

@Controller('admin')
@UseGuards(AdminAuthGuard)
export class AdminMiniSongController {
  constructor(private readonly adminService: AdminMiniSongService) {}

  @Get('mini-songs/list-minisongs')
  @Roles('ADMIN')
  async getAllMiniSong() {
    const result = await this.adminService.getAllMiniSong();
    return result;
  }
  @Get('stories/list-stories')
  @Roles('ADMIN')
  async getAllStory() {
    return await this.adminService.getAllStory();
  }

  @Post('mini-songs/fetch-youtube')
  @Roles('ADMIN')
  async fetchYoutube(@Body() dto: AdminFetchYoutubeDto) {
    return this.adminService.getPreviewFromYoutube(
      dto.video_url,
      dto.category,
      dto.manual_text,
    );
  }
  @Post('mini-songs')
  @Roles('ADMIN')
  async saveSong(@Body() dto: AdminCreateFullSongDto) {
    return await this.adminService.confirmAndCreate(dto);
  }

  @Delete('mini-songs/:id')
  @Roles('ADMIN')
  async deleteMiniSong(@Param('id') id: string) {
    return await this.adminService.deleteMiniSong(id);
  }

  @Delete('stories/:id')
  @Roles('ADMIN')
  async deletestory(@Param('id') id: number) {
    return await this.adminService.deleteStory(id);
  }
}
