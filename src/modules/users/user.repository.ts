import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getInformationById(userId: string) {
    return await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        fullName: true,
        email: true,
        avatar_url: true,
        birth_date: true,
        gender: true,
        children: true,
      },
    });
  }

  async updateUserInformation(
    userId: string,
    fullName: string,
    birth_date: Date,
    gender: string,
    avatar_url?: string,
  ) {
    const updateData: any = {
      fullName,
      birth_date,
      gender,
    };

    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url;
    }

    return await this.prisma.users.update({
      where: { id: userId },
      data: updateData,
      select: {
        fullName: true,
        birth_date: true,
        gender: true,
        avatar_url: true,
      },
    });
  }

  async updateChildInfomation(
    childId: string,
    fullName: string,
    birth_date: Date,
    avatar_url?: string,
  ) {
    const updateData: any = {
      full_name: fullName,
      birth_date,
    };

    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url;
    }

    return await this.prisma.children.update({
      where: { child_id: childId },
      data: updateData,
      select: {
        full_name: true,
        birth_date: true,
        avatar_url: true,
      },
    });
  }
}
