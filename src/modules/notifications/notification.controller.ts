import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateFcmTokenDto } from './dto/update-fcm-token.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('fcm-token')
  async updateFcmToken(
    @Request() req,
    @Body() updateFcmTokenDto: UpdateFcmTokenDto,
  ) {
    return await this.notificationService.updateFcmToken(
      req.user.sub,
      updateFcmTokenDto.fcmToken,
    );
  }

  @Get()
  async getNotifications(@Request() req) {
    return await this.notificationService.getUserNotifications(req.user.sub);
  }

  @Patch(':id/read')
  async markNotificationAsRead(@Param('id') notificationId: string) {
    return await this.notificationService.markNotificationAsRead(
      notificationId,
    );
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return await this.notificationService.getUnreadCount(req.user.sub);
  }

  @Delete('cleanup')
  async cleanupAllNotifications(@Request() req) {
    return await this.notificationService.cleanupAllNotifications(req.user.sub);
  }
}
