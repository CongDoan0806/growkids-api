import { Module } from '@nestjs/common';
import { ScheduleController } from './visual-schedule.controller';
import { ScheduleService } from './visual-schedule.service';
import { ScheduleRepository } from './visual-schedule.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleRepository],
})
export class VisualScheduleModule {}
