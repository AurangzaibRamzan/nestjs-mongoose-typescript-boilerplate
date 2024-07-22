import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthCheck {
  getPong(): string {
    return 'pong';
  }
}
