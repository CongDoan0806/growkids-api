export class DashboardSummaryDto {
  totalUsers: number;
  totalChildren: number;
  totalSongs: number;
  totalStories: number;
  activeAIVisionUsers: number;
  activeAIChatUsers: number;
}

export class AIActivityDto {
  name: string;
  Vision: number;
  Chat: number;
}

export class DashboardStatsDto {
  success: boolean;
  message: string;
  data: {
    summary: DashboardSummaryDto;
    contentMix: { type: string; count: number }[];
    aiTrends: AIActivityDto[];
    topContent: { title: string; views: number }[];
  };
}
