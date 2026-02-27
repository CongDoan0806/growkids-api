import { Module } from '@nestjs/common';
import { VoiceController } from './voice.controller';
import { VoiceService } from './voice.service';
import { ConversationModule } from '../conversations/conversation.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConversationModule, AuthModule],
  controllers: [VoiceController],
  providers: [VoiceService],
})
export class VoiceModule {}
