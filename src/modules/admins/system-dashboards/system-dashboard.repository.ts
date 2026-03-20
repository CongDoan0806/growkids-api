import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DashBoardsRepository {
  constructor(private prisma: PrismaService) {}

  async getCounts() {
    const [users, children, songs, stories] = await Promise.all([
      this.prisma.users.count(),
      this.prisma.children.count(),
      this.prisma.mini_songs.count(),
      this.prisma.stories.count(),
    ]);
    return { users, children, songs, stories };
  }

  async getTopSongs(limit = 5) {
    return this.prisma.mini_songs.findMany({
      take: limit,
      orderBy: { views: 'desc' },
      select: { title: true, views: true },
    });
  }

  async getLearningLogsLast7Days() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.prisma.learning_logs.groupBy({
      by: ['started_at'],
      _count: { learning_log_id: true },
      where: { started_at: { gte: sevenDaysAgo } },
    });
  }
  async getUniqueAIUsersLast30Days() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const [visionUsers, chatUsers] = await Promise.all([
      this.prisma.object_recognition_logs.findMany({
        where: { created_at: { gte: thirtyDaysAgo } },
        select: { child_id: true, created_at: true },
      }),
      this.prisma.conversations.findMany({
        where: { created_at: { gte: thirtyDaysAgo } },
        select: { user_id: true, created_at: true },
      }),
    ]);

    return { visionUsers, chatUsers };
  }
}
