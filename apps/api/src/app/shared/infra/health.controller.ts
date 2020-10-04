import { Controller, Get } from '@nestjs/common';
import {
  DNSHealthIndicator,
  HealthCheck,
  HealthCheckService,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dns: DNSHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    // TODO: add real address when we have one.
    return this.health.check([
      () => this.dns.pingCheck('google', 'https://google.com'),
    ]);
  }
}
