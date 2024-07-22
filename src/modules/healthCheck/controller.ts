import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from './service';

@Controller()
export class HealthCheckController {
  constructor(private readonly appService: HealthCheck) {}

  @Get('/ping')
  getPong(): string {
    return this.appService.getPong();
  }
}
