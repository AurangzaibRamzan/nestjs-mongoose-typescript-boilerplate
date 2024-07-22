import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckController } from './controller';
import { HealthCheck } from './service';

describe('HealthCheckController route test', () => {
  let healthCheckController: HealthCheckController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
      providers: [HealthCheck],
    }).compile();

    healthCheckController = app.get<HealthCheckController>(
      HealthCheckController,
    );
  });

  describe('root', () => {
    it('should return pong', () => {
      expect(healthCheckController.getPong()).toBe('pong');
    });
  });
});
