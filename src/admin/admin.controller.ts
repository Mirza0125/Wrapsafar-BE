import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Admin dashboard interface' })
  async adminPanel(@Res() res: Response) {
    const stats = await this.adminService.getDashboardStats();
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Wrapsafar Admin Panel</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; }
            .header { background: #333; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .users-section { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .user-item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
            .btn-danger { background: #dc3545; }
            .btn-success { background: #28a745; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Wrapsafar Admin Panel</h1>
                <p>Manage your application data</p>
            </div>
            
            <div class="stats">
                <div class="stat-card">
                    <h3>Total Users</h3>
                    <h2>${stats.totalUsers}</h2>
                </div>
                <div class="stat-card">
                    <h3>API Documentation</h3>
                    <a href="/api" class="btn">View Swagger Docs</a>
                </div>
            </div>
            
            <div class="users-section">
                <h2>Recent Users</h2>
                <div id="users-list">
                    ${stats.recentUsers.map(user => `
                        <div class="user-item">
                            <strong>${user.name || 'No Name'}</strong> (${user.email})
                            <div style="float: right;">
                                <button class="btn btn-success" onclick="editUser('${user._id}')">Edit</button>
                                <button class="btn btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <script>
            async function editUser(id) {
                const newName = prompt('Enter new name:');
                if (newName) {
                    try {
                        const response = await fetch(\`/admin/users/\${id}\`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name: newName })
                        });
                        if (response.ok) {
                            alert('User updated successfully!');
                            location.reload();
                        }
                    } catch (error) {
                        alert('Error updating user');
                    }
                }
            }
            
            async function deleteUser(id) {
                if (confirm('Are you sure you want to delete this user?')) {
                    try {
                        const response = await fetch(\`/admin/users/\${id}\`, {
                            method: 'DELETE'
                        });
                        if (response.ok) {
                            alert('User deleted successfully!');
                            location.reload();
                        }
                    } catch (error) {
                        alert('Error deleting user');
                    }
                }
            }
        </script>
    </body>
    </html>
    `;
    
    res.send(html);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users (admin)' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID (admin)' })
  @ApiResponse({ status: 200, description: 'User details' })
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id')
  @ApiOperation({ summary: 'Update user (admin)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async updateUser(@Param('id') id: string, @Body() updateData: any) {
    return this.adminService.updateUser(id, updateData);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user (admin)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }
}
