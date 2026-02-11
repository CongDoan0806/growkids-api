import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GoldenTimeController } from './golden-time.controller';
import { GoldenTimeService } from './golden-time.service';
import { GoldenTimeRepository } from './golden-time.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [GoldenTimeController],
  providers: [GoldenTimeService, GoldenTimeRepository],
})
export class GoldenTimeModule {}
