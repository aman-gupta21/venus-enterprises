

import {
  Controller,
  Get,
  ServiceUnavailableException,
} from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service.js';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Check API and database health' })
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        success: true,
        data: {
          api: 'healthy',
          database: 'connected',
          timestamp: new Date().toISOString(),
        },
      };
    } catch {
      throw new ServiceUnavailableException({
        success: false,
        data: {
          api: 'healthy',
          database: 'disconnected',
        },
      });
    }
  }
}
