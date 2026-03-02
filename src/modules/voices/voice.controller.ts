import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  Req,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { VoiceService } from './voice.service';
import { JwtHelper } from 'src/common/utils/jwtHelper';
import { Request } from 'express';

@Controller('voice')
export class VoiceController {
  constructor(
    private readonly voiceService: VoiceService,
    private readonly jwtHelper: JwtHelper,
  ) {}

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('audio'))
  async transcribe(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Audio file is required');
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new BadRequestException('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.jwtHelper.verifyAccessToken(token);
      const userId = payload.sub;
      return this.voiceService.transcribe(file.buffer, userId);
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
