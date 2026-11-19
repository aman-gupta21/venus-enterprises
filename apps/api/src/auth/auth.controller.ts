import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { UsersService } from '../users/users.service.js';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard.js';

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
  };
};

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  async getMe(@Req() request: AuthenticatedRequest) {
    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException();
    }

    const profile = await this.usersService.findOrCreateProfile(userId);

    if (!profile || !profile.isActive) {
      throw new UnauthorizedException('Active profile not found');
    }

    return profile;
  }
}
