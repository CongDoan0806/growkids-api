import { Injectable } from '@nestjs/common';
import { children, users } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
      include: { children: true },
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
  createUser(
    fullName: string,
    email: string,
    password: string,
  ): Promise<users> {
    return this.prisma.users.create({
      data: {
        fullName,
        email,
        password,
      },
    });
  }

  createChildren(user_id: string): Promise<children> {
    return this.prisma.children.create({
      data: {
        full_name: '',
        users: {
          connect: { id: user_id },
        },
      },
    });
  }
}
