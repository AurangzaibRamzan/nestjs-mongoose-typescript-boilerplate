import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './service';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/users')
  async createUser(
    @Body() body: { userId: number; email: string; avatar: string },
  ) {
    const { userId, email, avatar } = body;
    return this.usersService.createUser(userId, email, avatar);
  }

  @Get('/user/:userId')
  async getUser(@Param('userId') userId: number) {
    return this.usersService.getUser(userId);
  }

  @Get('/user/:userId/avatar')
  async getUserAvatar(@Param('userId') userId: number) {
    return this.usersService.getUserAvatar(userId);
  }

  @Delete('/user/:userId/avatar')
  async deleteUserAvatar(@Param('userId') userId: number) {
    await this.usersService.deleteUserAvatar(userId);
    return { message: 'Avatar deleted successfully' };
  }
}
