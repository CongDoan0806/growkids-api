import {
  Controller,
  UseGuards,
  Request,
  Get,
  Body,
  Post,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UpdateUserPayloadDto } from './dto/udate-user-payload.dto';
import { UpdateChildPayloadDto } from './dto/update-child-payload.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('me')
  async getMyInformation(@Request() req) {
    return await this.userService.getInformationById(req.user.sub);
  }

  @Post()
  async updateUserInfomation(
    @Request() req,
    @Body() user: UpdateUserPayloadDto,
  ) {
    return await this.userService.updateUserInformation(req.user.sub, user);
  }

  @Post('child/:childId')
  async updateChildInfomation(
    @Param('childId') childId,
    @Body() child: UpdateChildPayloadDto,
  ) {
    return await this.userService.updateChildInfomation(childId, child);
  }

  @Get('daily-stats')
  async getDailyStats(@Request() req) {
    return await this.userService.getDailyLearningStats(req.user.sub);
  }

  @Get('streak')
  async getUserStreak(@Request() req) {
    const streakInfo = await this.userService.getUserStreakInfo(req.user.sub);
    return {
      success: true,
      data: streakInfo,
    };
  }

  @Post('streak')
  async updateStreak(@Request() req) {
    const result = await this.userService.updateUserStreak(req.user.sub);
    return {
      success: true,
      data: result,
    };
  }
}
