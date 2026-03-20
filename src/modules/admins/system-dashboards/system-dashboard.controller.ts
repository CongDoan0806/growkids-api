import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashBoardsService } from './system-dashboard.service';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('admin/statistics')
@UseGuards(AdminAuthGuard)
export class DashBoardsController {
  constructor(private readonly statsService: DashBoardsService) {}

  @Get('dashboard')
  @Roles('ADMIN')
  async getDashboard() {
    return this.statsService.getMainDashboardStats();
  }
}
