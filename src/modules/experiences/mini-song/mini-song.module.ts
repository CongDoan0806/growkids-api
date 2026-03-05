import { Module } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { JwtHelper } from '../../../common/utils/jwtHelper';
import { JwtModule } from '@nestjs/jwt';
import { MiniSongService } from './mini-song.service';
import { MiniSongRepository } from './mini-song.repository';
import { MiniSongController } from './mini-song.controller';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [MiniSongController],
  providers: [
    MiniSongService,
    MiniSongRepository,
    PrismaService,
    JwtAuthGuard,
    JwtHelper,
  ],
  exports: [MiniSongService],
})
export class MiniSongModule {}
