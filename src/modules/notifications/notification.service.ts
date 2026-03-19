import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationRepository } from './notification.repository';
import { FirebaseService } from '../../common/firebase/firebase.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Cron('* * * * *')
  async checkGoldenTimeSlots() {
    const targetTime = this.calculateTargetTime();

    try {
      const upcomingSlots =
        await this.notificationRepository.findUpcomingGoldenTimeSlots(
          targetTime,
        );

      for (const slot of upcomingSlots) {
        await this.processSlotNotification(slot);
      }

      if (upcomingSlots.length > 0) {
        this.logger.log(
          `Sent ${upcomingSlots.length} golden time notifications`,
        );
      }
    } catch (error) {
      this.logger.error('Error checking golden time slots:', error);
    }
  }

  @Cron('0 0 * * *')
  async resetNotificationFlags() {
    try {
      const result =
        await this.notificationRepository.resetAllNotificationFlags();
      this.logger.log(`Reset ${result.count} notification flags`);
    } catch (error) {
      this.logger.error('Error resetting notification flags:', error);
    }
  }

  @Cron('*/15 * * * *')
  async checkMissedGoldenTimeSlots() {
    try {
      const missedSlots =
        await this.notificationRepository.findMissedGoldenTimeSlots();

      let actualSentCount = 0;

      for (const slot of missedSlots) {
        const wasSent = await this.processMissedSlotNotification(slot);
        if (wasSent) {
          actualSentCount++;
        }
      }

      if (actualSentCount > 0) {
        this.logger.log(
          `Sent ${actualSentCount} missed golden time notifications`,
        );
      } else if (missedSlots.length > 0) {
        this.logger.log(
          `Found ${missedSlots.length} missed slots but all users already learned`,
        );
      }
    } catch (error) {
      this.logger.error('Error checking missed golden time slots:', error);
    }
  }

  async updateFcmToken(userId: string, fcmToken: string) {
    return await this.notificationRepository.updateUserFcmToken(
      userId,
      fcmToken,
    );
  }

  private calculateTargetTime(): string {
    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);
    return `${tenMinutesLater.getHours().toString().padStart(2, '0')}:${tenMinutesLater.getMinutes().toString().padStart(2, '0')}`;
  }

  private async processSlotNotification(slot: any) {
    const user = slot.routine.children.users;
    if (!user.fcmToken) return;

    try {
      const title = `⏰ Khung giờ vàng của bé ${slot.routine.children.full_name} sẽ bắt đầu lúc ${slot.start_time}`;
      const body = 'Hãy chuẩn bị cùng bé cho hoạt động học thú vị nhé!✨';
      await this.sendGoldenTimeNotification(
        user.fcmToken,
        slot.slot_type,
        slot.start_time,
        slot.routine.children.full_name,
      );
      await this.notificationRepository.saveNotification(
        user.id,
        title,
        body,
        'golden_time',
        {
          slot_type: slot.slot_type,
          start_time: slot.start_time,
          child_name: slot.routine.children.full_name,
          slot_id: slot.slot_id,
        },
      );
      await this.notificationRepository.markSlotAsNotified(slot.slot_id);
    } catch (error) {
      this.logger.error(`Error processing slot ${slot.slot_id}:`, error);
    }
  }

  private async sendGoldenTimeNotification(
    fcmToken: string,
    slotType: string,
    startTime: string,
    childName: string,
  ) {
    const title = `⏰ Bé ${childName} ơi khung giờ vàng của sẽ bắt đầu lúc ${startTime}`;
    const body = 'Hãy chuẩn bị cho hoạt động học thú vị nhé!✨';

    await this.firebaseService.sendNotification(fcmToken, title, body, {
      type: 'golden_time',
      slot_type: slotType,
      start_time: startTime,
      child_name: childName,
    });
  }
  async getUserNotifications(userId: string, limit = 20) {
    return await this.notificationRepository.getUserNotifications(
      userId,
      limit,
    );
  }

  async markNotificationAsRead(notificationId: string) {
    return await this.notificationRepository.markNotificationAsRead(
      notificationId,
    );
  }

  async getUnreadCount(userId: string) {
    return await this.notificationRepository.getUnreadNotificationCount(userId);
  }

  async cleanupAllNotifications(userId: string) {
    return await this.notificationRepository.cleanupAllNotifications(userId);
  }

  private async processMissedSlotNotification(slot: any): Promise<boolean> {
    const user = slot.routine.children.users;

    if (!user.fcmToken) {
      return false;
    }

    const hasLearningToday =
      slot.learning_logs && slot.learning_logs.length > 0;

    if (hasLearningToday) {
      return false;
    }

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const existingMissedNotification =
      await this.notificationRepository.getUserNotifications(user.id, 50);
    const alreadySentMissed = existingMissedNotification.some(
      (notif) =>
        notif.type === 'missed_golden_time' &&
        notif.data &&
        typeof notif.data === 'object' &&
        (notif.data as any).slot_id === slot.slot_id &&
        notif.sent_at >= startOfDay &&
        notif.sent_at < endOfDay,
    );

    if (alreadySentMissed) {
      return false;
    }

    try {
      const title = `😭 Bạn đã bỏ lỡ khung giờ vàng của bé ${slot.routine.children.full_name}`;
      const body = `Khung giờ ${slot.slot_type} lúc ${slot.start_time} đã qua rồi. Hãy cố gắng hoàn thành vào ngày mai nhé! 💪`;

      await this.sendMissedGoldenTimeNotification(
        user.fcmToken,
        slot.slot_type,
        slot.start_time,
        slot.routine.children.full_name,
      );

      await this.notificationRepository.saveNotification(
        user.id,
        title,
        body,
        'missed_golden_time',
        {
          slot_type: slot.slot_type,
          start_time: slot.start_time,
          child_name: slot.routine.children.full_name,
          slot_id: slot.slot_id,
          missed_date: new Date().toISOString().split('T')[0],
        },
      );

      return true;
    } catch (error) {
      this.logger.error(`Error processing missed slot ${slot.slot_id}:`, error);
      return false;
    }
  }

  private async sendMissedGoldenTimeNotification(
    fcmToken: string,
    slotType: string,
    startTime: string,
    childName: string,
  ) {
    const title = `😭 Bạn đã bỏ lỡ khung giờ vàng của bé ${childName}`;
    const body = `Khung giờ ${slotType} lúc ${startTime} đã qua rồi. Hãy cố gắng hoàn thành vào ngày mai nhé! 💪`;

    await this.firebaseService.sendNotification(fcmToken, title, body, {
      type: 'missed_golden_time',
      slot_type: slotType,
      start_time: startTime,
      child_name: childName,
    });
  }
}
