import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
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
}
