import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';

import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async createConversation(@Body() dto: CreateConversationDto) {
    return this.conversationService.processConversation(dto);
  }

  @Get('user/:user_id')
  async getByUser(@Param('user_id') user_id: string) {
    return this.conversationService.getByUserId(user_id);
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
