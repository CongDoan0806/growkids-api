import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AdminAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAdminByEmail(email: string) {
    return await this.prisma.admin.findUnique({
      where: { email },
    });
  }

  async updateRefreshToken(adminId: string, refreshToken: string) {
    return await this.prisma.admin.update({
      where: { id: adminId },
      data: { refreshToken },
    });
  }
}
