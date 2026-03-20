import { Injectable, BadRequestException } from '@nestjs/common';
import * as ytdl from '@distube/ytdl-core';
import { AdminMiniSongRepository } from './learning-content-manage.repository';
import { AdminCreateFullSongDto } from './dto/admin-minisong.dto';

@Injectable()
export class AdminMiniSongService {
  constructor(private adminRepo: AdminMiniSongRepository) {}

  async getAllMiniSong() {
    return this.adminRepo.findAllMinisong();
  }

  async getPreviewFromYoutube(
    videoUrl: string,
    category?: string,
    manualText?: string,
  ) {
    try {
      const info = await ytdl.getBasicInfo(videoUrl);

      const basicData = {
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails[0]?.url || '',
        duration: parseInt(info.videoDetails.lengthSeconds),
        category: category || 'English for Kids',
        video_url: videoUrl,
      };

      const lyrics = [];
      if (manualText) {
        const blocks = manualText.split(/(?=\d{1,2}:\d{2})/g);
        let index = 1;

        for (const block of blocks) {
          const timeMatch = block.match(/(\d{1,2}):(\d{2})/);

          if (timeMatch) {
            const minutes = parseInt(timeMatch[1]);
            const seconds = parseInt(timeMatch[2]);
            const totalSeconds = minutes * 60 + seconds;
            const cleanLine = block
              .replace(/^\d{1,2}:\d{2}/, '')
              .replace(/\d+\s*phút,?\s*/gi, '')
              .replace(/\d+\s*giây/gi, '')
              .replace(/^[,\s.-]+/, '')
              .replace(/\[Music\]/gi, '')
              .replace(/[\r\n\t]+/g, ' ')
              .trim();

            if (cleanLine && cleanLine.length > 1) {
              lyrics.push({
                line_order: index++,
                start_time: totalSeconds,
                lyric_text: cleanLine,
                phonetic: '',
              });
            }
          }
        }
      }
      return {
        success: true,
        data: { ...basicData, lyrics },
      };
    } catch (error) {
      throw new BadRequestException(`Extraction error:${error.message}`);
    }
  }

  async confirmAndCreate(dto: AdminCreateFullSongDto) {
    const isExist = await this.adminRepo.checkExist(dto.title);
    if (isExist) throw new BadRequestException('The song already exists!');
    return this.adminRepo.createNewSongWithLyrics(dto);
  }

  async deleteMiniSong(id: string) {
    try {
      return await this.adminRepo.deleteMiniSong(id);
    } catch (error) {
      console.error('PRISMA DELETION ERROR:', error);
      throw new BadRequestException(
        'This song cannot be deleted, or the song does not exist.',
      );
    }
  }

  async getAllStory() {
    const result = await this.adminRepo.findAllStory();
    if (!result) {
      throw new BadRequestException('There are no series at all!');
    }
    return result;
  }

  async deleteStory(id: number) {
    try {
      return await this.adminRepo.deteleStory(id);
    } catch (error) {
      console.error('PRISMA DELETION ERROR:', error);
      throw new BadRequestException(
        'This story cannot be deleted, or the story does not exist.',
      );
    }
  }
}
