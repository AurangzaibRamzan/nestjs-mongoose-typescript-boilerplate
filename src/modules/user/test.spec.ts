import * as fs from 'fs';
import * as path from 'path';
import mongoose, { Connection, Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';

import { UsersController } from './controller';
import { UsersService } from './service';
import { User, UserSchema } from './schema';

describe('Users Module', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let moduleRef: TestingModule;
  let connection: Connection;
  let userModel: Model<User>;

  beforeAll(async () => {
    const mongoUri = 'mongodb://localhost:27017/test_db';

    await mongoose.connect(mongoUri);
    connection = mongoose.connection;

    moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
    userModel = moduleRef.get<Model<User>>(getModelToken(User.name));
  });

  afterAll(async () => {
    await userModel.deleteMany({});
    await connection.close();
  });

  beforeEach(async () => {
    await userModel.deleteMany({});
  });

  describe('UsersController', () => {
    describe('createUser', () => {
      it('should create a user', async () => {
        const userData = {
          userId: 1,
          email: 'test@example.com',
          avatar: 'https://reqres.in/img/faces/7-image.jpg',
        };
        const result = await usersController.createUser(userData);
        expect(result.userId).toBe(userData.userId);
        expect(result.email).toBe(userData.email);
        expect(result.avatar).toBe(userData.avatar);
      });
    });

    describe('getUser', () => {
      it('should get a user', async () => {
        const userId = 1;

        const result = await usersController.getUser(userId);

        expect(typeof result.email).toBe('string');
        expect(typeof result.avatar).toBe('string');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test(result.email)).toBe(true);
        expect(result.avatar.startsWith('https://')).toBe(true);
      });
    });

    describe('getUserAvatar', () => {
      it('should get user avatar', async () => {
        const userId = 1;
        const avatarUrl = 'https://reqres.in/img/faces/7-image.jpg';
        await usersService.createUser(userId, 'test@example.com', avatarUrl);

        const result = await usersController.getUserAvatar(userId);

        const avatarPath = path.join(
          __dirname,
          '../../../',
          'avatars',
          `${userId}.png`,
        );
        const avatarData = fs.readFileSync(avatarPath); // Read image file
        const base64Image = avatarData.toString('base64');
        // Check if the result matches the base64 encoded image
        expect(result).toMatch(base64Image);
      });
    });

    describe('deleteUserAvatar', () => {
      it('should delete user avatar', async () => {
        const userId = 1;
        const avatarUrl = 'https://reqres.in/img/faces/7-image.jpg';
        await usersService.createUser(userId, 'test@example.com', avatarUrl);
        await usersController.getUserAvatar(userId);

        const result = await usersController.deleteUserAvatar(userId);
        expect(result).toEqual({ message: 'Avatar deleted successfully' });

        // Check if the avatarHash is null after deletion
        const user = await usersService['userModel'].findOne({ userId });
        expect(user.avatarHash).toBeNull();

        // Check if the avatar file is actually deleted from the filesystem
        const avatarPath = path.join(
          __dirname,
          '../../../',
          'avatars',
          `${userId}.png`,
        );
        expect(fs.existsSync(avatarPath)).toBe(false);
      });
    });
  });
});
