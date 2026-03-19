import { Module } from '@nestjs/common';
import { UserManagementController } from './user-management.controller';
import { UserManagermentService } from './user-management.service';
import { UserManagermentRepository } from './user-management.repository';
import { PrismaService } from 'src/database/prisma.service';
import { AdminAuthModule } from '../auth/admin-auth.module';
import { JwtHelper } from 'src/common/utils/jwtHelper';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AdminAuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_fallback_secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [UserManagementController],
  providers: [
    UserManagermentService,
    UserManagermentRepository,
    PrismaService,
    JwtHelper,
  ],
})
export class UserManagerModule {}
