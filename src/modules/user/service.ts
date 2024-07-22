import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RabbitMQService } from '../../utils/rabbitmq';
import { User } from './schema';
import { REQRES_URL } from '../../config';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(
    userId: number,
    email: string,
    avatar: string,
  ): Promise<User> {
    const newUser = new this.userModel({ userId, email, avatar });
    await newUser.save();
    // Dummy email and RabbitMQ event sending
    const rabbitMQService = new RabbitMQService();
    await rabbitMQService.publish('user_created', { userId, email });

    return newUser;
  }

  async getUser(userId: number): Promise<any> {
    const { data } = await axios.get(`${REQRES_URL}/api/users/${userId}`);
    return data.data;
  }

  async getUserAvatar(userId: number): Promise<string> {
    const user = await this.userModel.findOne({ userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const avatarPath = path.join(
      __dirname,
      '../../../',
      'avatars',
      `${userId}.png`,
    );
    if (!fs.existsSync(avatarPath)) {
      const response = await axios.get(user.avatar, {
        responseType: 'arraybuffer',
      });
      fs.writeFileSync(avatarPath, response.data);

      const hash = crypto.createHash('md5').update(response.data).digest('hex');
      user.avatarHash = hash;
      await user.save();
    }

    const avatarData = fs.readFileSync(avatarPath);
    return avatarData.toString('base64');
  }

  async deleteUserAvatar(userId: number): Promise<void> {
    const user = await this.userModel.findOne({ userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const avatarPath = path.join(
      __dirname,
      '../../../',
      'avatars',
      `${userId}.png`,
    );
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }

    user.avatarHash = null;
    await user.save();
  }
}
