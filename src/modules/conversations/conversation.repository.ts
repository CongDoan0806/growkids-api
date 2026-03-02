import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ConversationDataDto } from './dto/conversation-data.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createConversation(data: ConversationDataDto) {
    return this.prisma.conversations.create({
      data: {
        conversation_type: data.conversation_type,
        input_text: data.input_text,
        output_text: data.output_text,
        phonetic: data.phonetic,
        suggestions: data.suggestions as unknown as Prisma.JsonValue,

        users: {
          connect: {
            id: data.user_id,
          },
        },
      },
    });
  }
  async findByUserId(user_id: string) {
    return this.prisma.conversations.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(conversation_id: string) {
    return this.prisma.conversations.findUnique({
      where: { conversation_id },
    });
  }

  async deleteById(conversation_id: string) {
    return this.prisma.conversations.delete({
      where: { conversation_id },
    });
  }
}
