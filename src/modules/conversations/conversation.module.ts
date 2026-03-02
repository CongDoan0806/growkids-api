import { Module } from '@nestjs/common';
import { AIService } from './ai/ai.service';
import { ConversationService } from './conversation.service';
import { ConversationRepository } from './conversation.repository';
import { PrismaService } from 'src/database/prisma.service';
import { ConversationController } from './conversation.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ConversationController],
  providers: [
    ConversationService,
    ConversationRepository,
    AIService,
    PrismaService,
  ],
  exports: [ConversationService],
})
export class ConversationModule {}
