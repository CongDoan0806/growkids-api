import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AdminCreateFullSongDto } from './dto/admin-minisong.dto';

@Injectable()
export class AdminMiniSongRepository {
  constructor(private prisma: PrismaService) {}

  async createNewSongWithLyrics(data: AdminCreateFullSongDto) {
    return this.prisma.mini_songs.create({
      data: {
        title: data.title,
        video_url: data.video_url,
        thumbnail: data.thumbnail,
        duration: data.duration,
        category: data.category,
        song_lyrics: {
          create: data.lyrics.map((lyric) => ({
            line_order: lyric.line_order,
            lyric_text: lyric.lyric_text,
            start_time: lyric.start_time,
            phonetic: lyric.phonetic,
          })),
        },
      },
      include: { song_lyrics: true },
    });
  }

  async checkExist(title: string) {
    return this.prisma.mini_songs.findUnique({ where: { title } });
  }

  async findAllMinisong() {
    return this.prisma.mini_songs.findMany({
      include: {
        song_lyrics: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async deleteMiniSong(id: string) {
    return this.prisma.mini_songs.delete({
      where: { mini_song_id: id },
    });
  }

  async findAllStory() {
    return this.prisma.stories.findMany({
      include: {
        _count: {
          select: {
            story_segments: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async deteleStory(id: number) {
    return this.prisma.stories.delete({
      where: { story_id: id },
    });
  }
}
