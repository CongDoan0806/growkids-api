import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { SentenceLibraryService } from './sentence-library.service';
import { SentencePayloadDto } from './dto/sentence-payload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sentence-library')
export class SentenceLibraryController {
  constructor(
    private readonly sentenceLibraryService: SentenceLibraryService,
  ) {}
  @Get('/children/:childId/topics')
  getTopics(@Param('childId') childId: string) {
    return this.sentenceLibraryService.getTopics(childId);
  }
  @Get(':childId/:topicId')
  getSentencesByTopic(
    @Param('childId') childId: string,
    @Param('topicId') topicId: string,
  ) {
    return this.sentenceLibraryService.getSentencesByTopic(childId, topicId);
  }

  @Post('pronunciation-checks')
  @UseInterceptors(FileInterceptor('audio'))
  async checkPronunciation(
    @UploadedFile() file: Express.Multer.File,
    @Body('sentence') sentence: string,
  ) {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }

    if (!sentence) {
      throw new BadRequestException('Sentence is required');
    }

    const result = await this.sentenceLibraryService.checkPronunciation(
      sentence,
      file.buffer,
    );

    return {
      success: true,
      data: result,
    };
  }

  @Post()
  createSentence(@Body() dto: SentencePayloadDto) {
    return this.sentenceLibraryService.createSentence(dto);
  }
}
