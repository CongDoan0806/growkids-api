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

  async saveNotification(
    userId: string,
    title: string,
    body: string,
    type: string,
    data?: any,
  ) {
    return await this.prisma.notifications.create({
      data: {
        user_id: userId,
        title,
        body,
        type,
        data: data || {},
      },
    });
  }

  async getUserNotifications(userId: string, limit = 20) {
    return await this.prisma.notifications.findMany({
      where: { user_id: userId },
      orderBy: { sent_at: 'desc' },
      take: limit,
    });
  }

  async markNotificationAsRead(notificationId: string) {
    return await this.prisma.notifications.update({
      where: { notification_id: notificationId },
      data: {
        is_read: true,
        read_at: new Date(),
      },
    });
  }

  async getUnreadNotificationCount(userId: string) {
    return await this.prisma.notifications.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });
  }

  async cleanupAllNotifications(userId: string) {
    return await this.prisma.notifications.deleteMany({
      where: { user_id: userId },
    });
  }

  async findMissedGoldenTimeSlots() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    return await this.prisma.golden_time_slots.findMany({
      where: {
        start_time: { lt: currentTime },
        is_active: true,
        is_notified: true,
        routine: {
          is_active: true,
        },
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
        learning_logs: {
          where: {
            started_at: {
              gte: today,
              lt: tomorrow,
            },
          },
        },
      },
    });
  }
}
