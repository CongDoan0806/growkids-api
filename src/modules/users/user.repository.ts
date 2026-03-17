import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getInformationById(userId: string) {
    return await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        fullName: true,
        email: true,
        avatar_url: true,
        birth_date: true,
        gender: true,
        children: true,
      },
    });
  }

  async updateUserInformation(
    userId: string,
    fullName: string,
    birth_date: Date,
    gender: string,
    avatar_url?: string,
  ) {
    const updateData: any = {
      fullName,
      birth_date,
      gender,
    };

    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url;
    }

    return await this.prisma.users.update({
      where: { id: userId },
      data: updateData,
      select: {
        fullName: true,
        birth_date: true,
        gender: true,
        avatar_url: true,
      },
    });
  }

  async updateChildInfomation(
    childId: string,
    fullName: string,
    birth_date: Date,
    avatar_url?: string,
  ) {
    const updateData: any = {
      full_name: fullName,
      birth_date,
    };

    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url;
    }

    return await this.prisma.children.update({
      where: { child_id: childId },
      data: updateData,
      select: {
        full_name: true,
        birth_date: true,
        avatar_url: true,
      },
    });
  }

  async getTotalSentencesByUserId(userId: string) {
    return await this.prisma.sentences.count({
      where: {
        children: {
          user_id: userId,
        },
      },
    });
  }

  async getTotalSentencesByChildId(childId: string) {
    return await this.prisma.sentences.count({
      where: {
        child_id: childId,
      },
    });
  }

  async getTotalConversationsByUserId(userId: string) {
    return await this.prisma.conversations.count({
      where: {
        user_id: userId,
      },
    });
  }

  async getTotalSongsLearnedByUserId(userId: string) {
    return await this.prisma.learning_logs.count({
      where: {
        children: {
          user_id: userId,
        },
        mini_song_id: {
          not: null,
        },
      },
    });
  }

  async getTotalSongsLearnedByChildId(childId: string) {
    return await this.prisma.learning_logs.count({
      where: {
        child_id: childId,
        mini_song_id: {
          not: null,
        },
      },
    });
  }

  async getTotalStoriesLearnedByUserId(userId: string) {
    return await this.prisma.learning_logs.count({
      where: {
        children: {
          user_id: userId,
        },
        story_id: {
          not: null,
        },
      },
    });
  }

  async getTotalStoriesLearnedByChildId(childId: string) {
    return await this.prisma.learning_logs.count({
      where: {
        child_id: childId,
        story_id: {
          not: null,
        },
      },
    });
  }

  async getUserStatistics(userId: string) {
    const [totalSentences, totalConversations, totalSongs, totalStories] =
      await Promise.all([
        this.getTotalSentencesByUserId(userId),
        this.getTotalConversationsByUserId(userId),
        this.getTotalSongsLearnedByUserId(userId),
        this.getTotalStoriesLearnedByUserId(userId),
      ]);

    return {
      totalSentences,
      totalConversations,
      totalSongs,
      totalStories,
      pronunciationScore: null,
    };
  }

  async getChildStatistics(childId: string) {
    const [totalSentences, totalSongs, totalStories] = await Promise.all([
      this.getTotalSentencesByChildId(childId),
      this.getTotalSongsLearnedByChildId(childId),
      this.getTotalStoriesLearnedByChildId(childId),
    ]);

    return {
      totalSentences,
      totalSongs,
      totalStories,
      pronunciationScore: null,
    };
  }
}
