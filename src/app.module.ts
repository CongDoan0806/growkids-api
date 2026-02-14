import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { HealthController } from './health/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { GoldenTimeModule } from './modules/golden-time/golden-time.module';
import { ScheduleModule } from './modules/schedules/schedule.module';
@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    GoldenTimeModule,
    ScheduleModule,
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
