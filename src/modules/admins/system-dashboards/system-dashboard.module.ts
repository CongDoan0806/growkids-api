import { Module } from '@nestjs/common';
import { DashBoardsController } from './system-dashboard.controller';
import { DashBoardsService } from './system-dashboard.service';
import { DashBoardsRepository } from './system-dashboard.repository';
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
  controllers: [DashBoardsController],
  providers: [DashBoardsService, DashBoardsRepository, JwtHelper],
})
export class DashBoardModule {}
