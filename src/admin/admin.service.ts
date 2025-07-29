import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  async getDashboardStats() {
    const users = await this.usersService.findAll();
    return {
      totalUsers: users.length,
      recentUsers: users.slice(-5), // Last 5 users
      stats: {
        users: users.length,
      }
    };
  }

  async getAllUsers() {
    return this.usersService.findAll();
  }

  async getUserById(id: string) {
    return this.usersService.findOneById(id);
  }

  async updateUser(id: string, updateData: any) {
    return this.usersService.updateUser(id, updateData);
  }

  async deleteUser(id: string) {
    return this.usersService.deleteUser(id);
  }
}
