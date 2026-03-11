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
      await this.sendGoldenTimeNotification(
        user.fcmToken,
        slot.slot_type,
        slot.start_time,
        slot.routine.children.full_name,
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
    const title = `Khung giờ vàng sẽ bắt đầu lúc ${startTime} ⏰`;
    const body = 'Hãy chuẩn bị cùng bé cho hoạt động học thú vị nhé!';

    await this.firebaseService.sendNotification(fcmToken, title, body, {
      type: 'golden_time',
      slot_type: slotType,
      start_time: startTime,
      child_name: childName,
    });
  }
}
