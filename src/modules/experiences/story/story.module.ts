import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { StoryRepository } from './story.repository';
import { AiService } from './ai/ai.service';
import { PrismaService } from '../../../database/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { AIShareModule } from '../../../common/AI/ai.module';
import { CloudinaryModule } from '../../../common/cloudinary/cloudinary.module';

@Module({
  imports: [ConfigModule, DatabaseModule, AIShareModule, CloudinaryModule],
  controllers: [StoryController],
  providers: [StoryService, StoryRepository, AiService, PrismaService],
  exports: [StoryService],
})
export class StoryModule {}
