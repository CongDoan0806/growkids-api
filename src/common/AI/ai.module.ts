import { Global, Module } from '@nestjs/common';
import { OpenAiSharedService } from './aiService';

@Global()
@Module({
  providers: [OpenAiSharedService],
  exports: [OpenAiSharedService],
})
export class AIShareModule {}
