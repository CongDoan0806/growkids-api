import { Body, Controller, Post } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryPayloadDto } from './dto/story-payload.dto';

@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}
  @Post()
  getStory(@Body() dto: StoryPayloadDto) {
    return this.storyService.createStory(
      dto.topic,
      dto.minAge,
      dto.maxAge,
      dto.length,
      dto.type,
      dto.prompt,
    );
  }
}
