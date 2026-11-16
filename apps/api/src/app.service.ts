import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealth() {
    return {
      success: true,
      message: 'Venus Enterprises API is running',
      data: {
        status: 'healthy',
        service: 'venus-api',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
