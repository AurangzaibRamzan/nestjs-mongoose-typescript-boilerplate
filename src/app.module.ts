import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthCheckModule } from './modules/healthCheck/module';
import { UsersModule } from './modules/user/module';

import { MONGODB_URL } from './config';

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URL),
    HealthCheckModule,
    UsersModule,
  ],
})
export class AppModule {}
