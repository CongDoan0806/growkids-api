import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Dùng chung thư viện Jwt của Nest
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthRepository } from './admin-auth.repository';
import { PrismaService } from 'src/database/prisma.service';
import { JwtHelper } from 'src/common/utils/jwtHelper';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_fallback_secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminAuthRepository, PrismaService, JwtHelper],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
