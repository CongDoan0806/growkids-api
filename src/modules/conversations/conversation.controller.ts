// src/modules/conversations/conversation.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { JwtHelper } from 'src/common/utils/jwtHelper';

@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly jwtHelper: JwtHelper,
  ) {}

  @Post()
  async createConversation(
    @Req() req: Request,
    @Body() dto: CreateConversationDto,
  ) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = this.jwtHelper.verifyAccessToken(token);
      const userId = payload.sub;

      return this.conversationService.processConversation({
        ...dto,
        user_id: userId,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Get('my-history')
  async getMyHistory(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Missing token');

    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.jwtHelper.verifyRefreshToken(token);
      return this.conversationService.getByUserId(payload.sub);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.conversationService.getById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.conversationService.delete(id);
  }
}
