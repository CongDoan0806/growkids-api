import { Injectable } from '@nestjs/common';
import { UserManagermentRepository } from './user-management.repository';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UserManagermentService {
  constructor(private readonly usersRepo: UserManagermentRepository) {}

  async getListUserAndSearch(query: SearchUserDto) {
    const { searchTerm, page = '1', limit = '10' } = query;

    let p = parseInt(page, 10);
    let l = parseInt(limit, 10);

    if (isNaN(p) || p <= 0) p = 1;
    if (isNaN(l) || l <= 0) l = 10;
    if (l > 100) l = 100;

    const skip = (p - 1) * l;
    const data = await this.usersRepo.findMany(skip, l, searchTerm);
    const total = await this.usersRepo.countUsers(searchTerm);

    if (total === 0) {
      return {
        data: [],
        total: 0,
        message: searchTerm
          ? `No user found matching: ${searchTerm}`
          : 'No user in the system yet',
        page: p,
        limit: l,
      };
    }
    const totalPages = Math.ceil(total / l);

    return {
      data,
      total,
      page: p,
      limit: l,
      totalPages: totalPages,
    };
  }

  async getUserDetail(id: string) {
    const user = await this.usersRepo.findOne(id);
    if (!user) {
      throw new Error(`User with ID ${id} does not exist`);
    }
    return user;
  }
  async updateUserStatus(id: string, status: string) {
    const user = await this.usersRepo.findOne(id);
    if (!user) {
      throw new Error(`User with ID ${id} does not exist`);
    }

    return await this.usersRepo.updateStatus(id, status);
  }
}
