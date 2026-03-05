import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { StoryRepository } from './story.repository';
import { AiService } from './ai/ai.service';
import { PrismaService } from '../../../database/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { AIShareModule } from '../../../common/ai/ai.module';
import { CloudinaryModule } from '../../../common/cloudinary/cloudinary.module';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { JwtHelper } from '../../../common/utils/jwtHelper';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AIShareModule,
    CloudinaryModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [StoryController],
  providers: [
    StoryService,
    StoryRepository,
    AiService,
    PrismaService,
    JwtAuthGuard,
    JwtHelper,
  ],
  exports: [StoryService],
})
export class StoryModule {}
