import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryPayloadDto } from './dto/story-payload.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
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
  @Get()
  getAllStories() {
    return this.storyService.getStories();
  }
}
