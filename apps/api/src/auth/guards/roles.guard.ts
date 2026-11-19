import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

interface AuthenticatedRequest {
  user?: {
    id?: string;
    appRole?: UserRole;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user?.id) {
      throw new ForbiddenException('User identity is missing');
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id: user.id },
      select: {
        role: true,
        isActive: true,
      },
    });

    if (!profile || !profile.isActive) {
      throw new ForbiddenException('Active user profile not found');
    }

    if (!requiredRoles.includes(profile.role)) {
      throw new ForbiddenException('You do not have permission');
    }

    user.appRole = profile.role;
    return true;
  }
}
