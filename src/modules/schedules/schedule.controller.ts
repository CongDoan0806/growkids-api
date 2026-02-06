import {
  Controller,
  Post,
  Body,
  Get,
  UsePipes,
  ValidationPipe,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from '../schedules/dto/schedule.dto';
import { ScheduleService } from './schedule.service';
import { ScheduleDto } from './dto/schedule.dto';
import * as jwt from 'jsonwebtoken';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  private getPayload(req: Request): UserPayload {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Missing token');

    const token = authHeader.replace('Bearer ', '');
    try {
      return jwt.verify(
        token,
        process.env.JWT_SECRET,
      ) as unknown as UserPayload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Get()
  async getStatus(@Req() req: Request) {
    const payload = this.getPayload(req);
    return this.scheduleService.getScheduleStatus(payload.sub);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async setup(@Req() req: Request, @Body() dto: ScheduleDto) {
    const payload = this.getPayload(req);
    return this.scheduleService.setupSchedule(payload.sub, dto);
  }
}
