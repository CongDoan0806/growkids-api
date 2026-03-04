import { Global, Module } from '@nestjs/common';
import { OpenAiSharedService } from './ai.service';

@Global()
@Module({
  providers: [OpenAiSharedService],
  exports: [OpenAiSharedService],
})
export class AIShareModule {}
