import { Injectable } from '@nestjs/common';
import { DashBoardsRepository } from './system-dashboard.repository';

@Injectable()
export class DashBoardsService {
  constructor(private repo: DashBoardsRepository) {}

  async getMainDashboardStats() {
    const [counts, topSongs, aiUsageRaw] = await Promise.all([
      this.repo.getCounts(),
      this.repo.getTopSongs(5),
      this.repo.getUniqueAIUsersLast30Days(),
    ]);

    const last30Days = [...Array(30)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toISOString().split('T')[0];
    });

    const aiTrends = last30Days.map((dateStr) => {
      const totalVisionLogs = aiUsageRaw.visionUsers.filter(
        (log) => log.created_at.toISOString().split('T')[0] === dateStr,
      ).length;
      const totalChatLogs = aiUsageRaw.chatUsers.filter(
        (log) => log.created_at.toISOString().split('T')[0] === dateStr,
      ).length;

      return {
        name: new Date(dateStr).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
        }),
        Vision: totalVisionLogs,
        Chat: totalChatLogs,
      };
    });

    return {
      success: true,
      message: 'Success',
      data: {
        contentMix: [
          { type: 'Mini Songs', count: counts.songs },
          { type: 'Stories', count: counts.stories },
        ],
        topContent: topSongs.map((s) => ({ title: s.title, views: s.views })),
        summary: {
          totalUsers: counts.users,
          totalChildren: counts.children,
          totalSongs: counts.songs,
          totalStories: counts.stories,
          totalAIVisionLogs: aiUsageRaw.visionUsers.length,
          totalAIChatLogs: aiUsageRaw.chatUsers.length,
        },
        aiTrends: aiTrends,
      },
    };
  }
}
