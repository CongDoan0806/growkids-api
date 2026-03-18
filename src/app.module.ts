import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { VoiceModule } from './modules/voices/voice.module';
import { AIModule } from './modules/conversations/ai/ai.module';
import { NotificationModule } from './modules/notifications/notification.module';

import { GoldenTimeModule } from './modules/golden-time/golden-time.module';
import { ScheduleModule } from './modules/schedules/schedule.module';
import { AIShareModule } from './common/ai/ai.module';
import { StoryModule } from './modules/experiences/story/story.module';
import { ObjectScanningModule } from './modules/object-scanning/object-scanning.module';
import { MiniSongModule } from './modules/experiences/mini-song/mini-song.module';
import { VisualScheduleModule } from './modules/visual-schedules/visual-schedule.module';
import { FlexibleScheduleModule } from './modules/flexible-schedule-suggest/flexible-schedule.module';
import { SentenceLibraryModule } from './modules/sentence-library/sentence-library.module';
import { UserManagerModule } from './modules/admins/user-management/user-management.module';
import { AdminAuthModule } from './modules/admins/auth/admin-auth.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    VoiceModule,
    AIModule,
    NotificationModule,
    GoldenTimeModule,
    ScheduleModule,
    AIShareModule,
    StoryModule,
    MiniSongModule,
    ObjectScanningModule,
    VisualScheduleModule,
    FlexibleScheduleModule,
    SentenceLibraryModule,
    UserManagerModule,
    AdminAuthModule,
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
