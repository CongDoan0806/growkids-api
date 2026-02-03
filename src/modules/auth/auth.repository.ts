import { Injectable } from '@nestjs/common';
import { users } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<users | null> {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }
  updateRefreshToken(userId: string, refreshToken: string): Promise<users> {
    return this.prisma.users.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
  removeRefreshToken(userId: string): Promise<users> {
    return this.prisma.users.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
