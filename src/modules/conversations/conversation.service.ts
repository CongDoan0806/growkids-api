import { Injectable } from '@nestjs/common';
import { AIResult, AIService, SuggestionItem } from './ai/ai.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ConversationRepository } from './conversation.repository';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly aiService: AIService,
  ) {}

  async processConversation(dto: CreateConversationDto) {
    if (!dto.input_text || dto.input_text.trim().length === 0) {
      throw new Error('Input text cannot be empty');
    }

    const aiResult: AIResult = await this.aiService.processText(dto.input_text);

    if (!aiResult || !aiResult.english) {
      throw new Error('Failed to process text with AI service');
    }

    const conversation = await this.conversationRepository.createConversation({
      user_id: dto.user_id,
      conversation_type: dto.conversation_type ?? 'voice',
      input_text: dto.input_text,
      output_text: aiResult.english,
      phonetic: aiResult.phonetic,
      suggestions: aiResult.suggestions as unknown as SuggestionItem[],
    });

    if (!conversation) {
      throw new Error('Failed to save conversation to the database');
    }

    return {
      conversation_id: conversation.conversation_id,
      input_text: dto.input_text,
      english: aiResult.english,
      phonetic: aiResult.phonetic,
      suggestions: aiResult.suggestions,
      audioBase64: aiResult.audioBase64,
    };
  }
  async getByUserId(user_id: string) {
    return this.conversationRepository.findByUserId(user_id);
  }

  async getById(conversation_id: string) {
    return this.conversationRepository.findById(conversation_id);
  }

  async delete(conversation_id: string) {
    return this.conversationRepository.deleteById(conversation_id);
  }
}
