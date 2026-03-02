import { Injectable } from '@nestjs/common';
import { ConversationService } from '../conversations/conversation.service';
import { CreateConversationDto } from '../conversations/dto/create-conversation.dto';
import { OpenAiSharedService } from 'src/common/AI/aiService';
@Injectable()
export class VoiceService {
  constructor(
    private readonly openAiShared: OpenAiSharedService,
    private readonly conversationService: ConversationService,
  ) {}

  async transcribe(audioBuffer: Buffer, user_id: string) {
    const text = await this.openAiShared.transcribe(audioBuffer);

    if (!text || text.trim() === '') {
      return {
        success: false,
        message: 'Không nhận diện được văn bản từ audio. Thử lại nhé!',
      };
    }

    const dto: CreateConversationDto = {
      user_id,
      input_text: text,
      conversation_type: 'voice',
    };

    const result = await this.conversationService.processConversation(dto);
    return { success: true, message: 'Success', data: result };
  }
}
