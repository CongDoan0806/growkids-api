import { Module } from '@nestjs/common';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';
import { ConversationModule } from '../conversations/conversation.module';

@Module({
  imports: [ConversationModule],
  controllers: [VoiceController],
  providers: [VoiceService],
})
export class VoiceModule {}
