import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class StoryRepository {
  constructor(private prisma: PrismaService) {}

  async createStoryWithSegments(
    storyData: {
      title: string;
      age_min: number;
      age_max: number;
      duration_seconds: number;
    },
    segments: Array<{
      segment_order: number;
      content_text: string;
      image_url: string;
      audio_url: string;
      interaction_type: string;
    }>,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const story = await tx.stories.create({
        data: storyData,
      });

      await tx.story_segments.createMany({
        data: segments.map((seg) => ({
          story_id: story.story_id,
          ...seg,
        })),
      });

      return await tx.stories.findUnique({
        where: { story_id: story.story_id },
        include: { story_segments: true },
      });
    });
  }
}
