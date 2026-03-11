import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { VoiceModule } from './modules/voices/voice.module';
import { AIModule } from './modules/conversations/ai/ai.module';

import { GoldenTimeModule } from './modules/golden-time/golden-time.module';
import { ScheduleModule } from './modules/schedules/schedule.module';
import { AIShareModule } from './common/ai/ai.module';
import { StoryModule } from './modules/experiences/story/story.module';
import { ObjectScanningModule } from './modules/object-scanning/object-scanning.module';
import { MiniSongModule } from './modules/experiences/mini-song/mini-song.module';
import { SentenceLibraryModule } from './modules/sentence-library/sentence-library.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    VoiceModule,
    AIModule,
    GoldenTimeModule,
    ScheduleModule,
    AIShareModule,
    StoryModule,
    MiniSongModule,
    ObjectScanningModule,
    SentenceLibraryModule,
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL ?? '60000'),
        limit: parseInt(process.env.MAX_REQUEST ?? '10'),
      },
    ]),
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
