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
}
