import { Injectable, Logger } from '@nestjs/common';
import { StoryRepository } from './story.repository';
import { AiService } from './ai/ai.service';
import { OpenAiSharedService } from '../../../common/ai/ai.service';
import { CloudinaryService } from '../../../common/cloudinary/cloudinary.service';

@Injectable()
export class StoryService {
  private readonly logger = new Logger(StoryService.name);

  constructor(
    private readonly storyRepository: StoryRepository,
    private readonly aiService: AiService,
    private readonly openAiShared: OpenAiSharedService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async createStory(
    topic: string,
    minAge: number,
    maxAge: number,
    length: number,
    type: string,
    prompt?: string,
  ) {
    this.logger.log('Generating story JSON...');
    const storyJson = await this.aiService.generateStory(
      topic,
      minAge,
      maxAge,
      length,
      type,
      prompt,
    );

    this.logger.log(`Processing ${storyJson.segments.length} segments...`);
    const processedSegments = [];

    for (const segment of storyJson.segments) {
      const imagePrompt = await this.aiService.generateImagePrompt(
        segment.content_text,
      );
      const imageBase64 = await this.openAiShared.generateImage(imagePrompt);
      const imageUrl = await this.cloudinary.uploadBase64(
        imageBase64,
        'stories/images',
      );

      const audioBase64 = await this.openAiShared.generateSpeech(
        segment.content_text,
      );
      const audioUrl = await this.cloudinary.uploadAudioBase64(
        audioBase64,
        'stories/audio',
      );

      processedSegments.push({
        segment_order: segment.segment_order,
        content_text: segment.content_text,
        interaction_type: segment.interaction_type,
        image_url: imageUrl,
        audio_url: audioUrl,
      });

      this.logger.log(`Segment ${segment.segment_order} processed`);
    }

    this.logger.log('Saving story to database...');
    const story = await this.storyRepository.createStoryWithSegments(
      {
        title: storyJson.title,
        age_min: storyJson.age_min,
        age_max: storyJson.age_max,
        duration_seconds: storyJson.duration_seconds,
      },
      processedSegments,
    );

    this.logger.log(`Story created successfully: ${story.story_id}`);
    return story;
  }
  async getStories() {
    try {
      return await this.storyRepository.getStories();
    } catch (error) {
      this.logger.error('Error occurred while fetching stories', error);
      throw error;
    }
  }
}
