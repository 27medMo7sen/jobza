import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health/db')
  getDbHealth() {
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    return {
      state: this.connection.readyState,
      ok: this.connection.readyState === 1,
    };
  }
}
