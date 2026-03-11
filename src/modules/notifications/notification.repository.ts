import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUpcomingGoldenTimeSlots(targetTime: string) {
    return await this.prisma.golden_time_slots.findMany({
      where: {
        start_time: targetTime,
        is_active: true,
        is_notified: false,
      },
      include: {
        routine: {
          include: {
            children: {
              include: {
                users: true,
              },
            },
          },
        },
      },
    });
  }

  async markSlotAsNotified(slotId: string) {
    return await this.prisma.golden_time_slots.update({
      where: { slot_id: slotId },
      data: { is_notified: true },
    });
  }

  async resetAllNotificationFlags() {
    return await this.prisma.golden_time_slots.updateMany({
      where: { is_notified: true },
      data: { is_notified: false },
    });
  }

  async updateUserFcmToken(userId: string, fcmToken: string) {
    return await this.prisma.users.update({
      where: { id: userId },
      data: { fcmToken },
    });
  }
}
