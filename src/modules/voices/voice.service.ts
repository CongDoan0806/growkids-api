import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConversationService } from '../conversations/conversation.service';
import { CreateConversationDto } from '../conversations/dto/create-conversation.dto';
import { toFile } from 'openai/uploads';

@Injectable()
export class VoiceService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(private readonly conversationService: ConversationService) {}

  async transcribe(audioBuffer: Buffer, user_id: string) {
    const file = await toFile(audioBuffer, 'audio.m4a', {
      type: 'audio/m4a',
    });

    const transcription = await this.openai.audio.transcriptions.create({
      file,

      model: 'whisper-1',
    });

    const text = transcription.text;

    if (!text || text.trim() === '') {
      return {
        success: false,
        message:
          'Không nhận diện được văn bản từ audio. Vui lòng thử lại với một đoạn audio rõ ràng hơn.',
      };
    }
    const dto: CreateConversationDto = {
      user_id,

      input_text: text,

      conversation_type: 'voice',
    };
    const result = await this.conversationService.processConversation(dto);
    return {
      success: true,
      message: 'Success',
      data: result,
    };
  }
}
