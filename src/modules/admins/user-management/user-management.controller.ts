import {
  Controller,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Patch,
  Body,
} from '@nestjs/common';
import { UserManagermentService } from './user-management.service';
import { SearchUserDto } from './dto/search-user.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AdminAuthGuard } from 'src/common/guards/admin-auth.guard';

@Controller('admin')
@UseGuards(AdminAuthGuard)
export class UserManagementController {
  constructor(private readonly userService: UserManagermentService) {}

  @Get()
  @Roles('ADMIN')
  async getList(@Query() query: SearchUserDto) {
    return await this.userService.getListUserAndSearch(query);
  }

  @Get(':id')
  @Roles('ADMIN')
  async getDetail(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.userService.getUserDetail(id);
  }

  @Patch(':id/status')
  @Roles('ADMIN')
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body('status') status: string,
  ) {
    return await this.userService.updateUserStatus(id, status);
  }
}
