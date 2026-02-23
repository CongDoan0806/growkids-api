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
      type: 'audio/wav',
    });

    const transcription = await this.openai.audio.transcriptions.create({
      file,

      model: 'whisper-1',
    });

    const text = transcription.text;

    const dto: CreateConversationDto = {
      user_id,

      input_text: text,

      conversation_type: 'voice',
    };

    return this.conversationService.processConversation(dto);
  }
}
