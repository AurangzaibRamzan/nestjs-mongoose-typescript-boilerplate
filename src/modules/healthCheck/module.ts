import { Module } from '@nestjs/common';
import { HealthCheckController } from './controller';
import { HealthCheck } from './service';

@Module({
  imports: [],
  controllers: [HealthCheckController],
  providers: [HealthCheck],
})
export class HealthCheckModule {}
