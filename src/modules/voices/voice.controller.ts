import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { VoiceService } from './voice.service';

@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('audio'))
  async transcribe(
    @UploadedFile() file: Express.Multer.File,

    @Body('user_id') user_id: string,
  ) {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }

    if (!user_id) {
      throw new BadRequestException('user_id is required');
    }

    return this.voiceService.transcribe(file.buffer, user_id);
  }
}
