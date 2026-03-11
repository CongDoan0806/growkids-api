import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FlexibleScheduleController } from './flexible-schedule.controller';
import { FlexibleScheduleService } from './flexible-schedule.service';
import { FlexibleScheduleRepository } from './flexible-schedule.repository';
import { FlexibleAiService } from './ai/ai.service';
import { PrismaService } from 'src/database/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, ConfigModule],
  controllers: [FlexibleScheduleController],
  providers: [
    FlexibleScheduleService,
    FlexibleScheduleRepository,
    FlexibleAiService,
    PrismaService,
  ],
})
export class FlexibleScheduleModule {}
