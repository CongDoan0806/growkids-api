import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from 'src/database/database.module';
import { SentenceLibraryController } from './sentence-library.controller';
import { SentenceLibraryService } from './sentence-library.service';
import { SentenceLibraryRepository } from './sentence-library.repository';
import { AiService } from './ai/ai.service';
import { OpenAiSharedService } from 'src/common/ai/ai.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtHelper } from '../../common/utils/jwtHelper';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [SentenceLibraryController],
  providers: [
    SentenceLibraryService,
    SentenceLibraryRepository,
    AiService,
    OpenAiSharedService,
    CloudinaryService,
    JwtAuthGuard,
    JwtHelper,
  ],
})
export class SentenceLibraryModule {}
