import { Module } from '@nestjs/common';
import { ObjectScanningController } from './object-scanning.controller';
import { ObjectScanningService } from './object-scanning.service';
import { ObJectScanningRepository } from './object-scanning.repository';
import { OpenAiSharedService } from 'src/common/ai/ai.service';
import { PrismaService } from 'src/database/prisma.service';
import { AIService } from './ai/ai.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ObjectScanningController],
  providers: [
    ObjectScanningService,
    ObJectScanningRepository,
    AIService,
    OpenAiSharedService,
    PrismaService,
  ],
})
export class ObjectScanningModule {}
