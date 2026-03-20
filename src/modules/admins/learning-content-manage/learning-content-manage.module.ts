import { Module } from '@nestjs/common';
import { AdminMiniSongController } from './learning-content-manage.controller';
import { AdminMiniSongService } from './learning-content-manage.service';
import { AdminMiniSongRepository } from './learning-content-manage.repository';
import { PrismaService } from 'src/database/prisma.service';
import { AdminAuthModule } from '../auth/admin-auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtHelper } from 'src/common/utils/jwtHelper';

@Module({
  imports: [
    AdminAuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_fallback_secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AdminMiniSongController],
  providers: [
    AdminMiniSongService,
    AdminMiniSongRepository,
    PrismaService,
    JwtHelper,
  ],
})
export class AdminMiniSongModule {}
