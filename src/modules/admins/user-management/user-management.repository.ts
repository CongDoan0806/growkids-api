import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserManagermentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(skip: number, take: number, searchTerm?: string) {
    return this.prisma.users.findMany({
      where: searchTerm
        ? {
            OR: [
              { fullName: { contains: searchTerm, mode: 'insensitive' } },
              { email: { contains: searchTerm, mode: 'insensitive' } },
            ],
          }
        : {},
      skip,
      take,
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        createdAt: true,
        _count: { select: { children: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countUsers(searchTerm?: string) {
    return this.prisma.users.count({
      where: searchTerm
        ? {
            OR: [
              { fullName: { contains: searchTerm, mode: 'insensitive' } },
              { email: { contains: searchTerm, mode: 'insensitive' } },
            ],
          }
        : {},
    });
  }

  async findOne(id: string) {
    return this.prisma.users.findUnique({
      where: { id },
      include: { children: true },
    });
  }
  async updateStatus(id: string, status: string) {
    return this.prisma.users.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        fullName: true,
        status: true,
      },
    });
  }
}
