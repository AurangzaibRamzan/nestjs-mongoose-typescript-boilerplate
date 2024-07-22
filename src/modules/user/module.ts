import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './service';
import { UsersController } from './controller';
import { User, UserSchema } from './schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
