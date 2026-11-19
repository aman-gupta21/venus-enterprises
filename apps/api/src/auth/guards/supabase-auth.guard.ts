import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify } from 'jose';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly supabaseUrl: string;
  private readonly audience: string;
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');

    if (!url) {
      throw new Error('SUPABASE_URL is missing from environment variables');
    }

    this.supabaseUrl = url.replace(/\/$/, '');
    this.audience =
      this.configService.get<string>('SUPABASE_JWT_AUDIENCE') ??
      'authenticated';

    this.jwks = createRemoteJWKSet(
      new URL(`${this.supabaseUrl}/auth/v1/.well-known/jwks.json`),
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access token is required');
    }

    const token = authorization.substring(7);

    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: `${this.supabaseUrl}/auth/v1`,
        audience: this.audience,
      });

      if (
        typeof payload.sub !== 'string' ||
        typeof payload.role !== 'string'
      ) {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.user = {
        id: payload.sub,
        role: payload.role,
        email:
          typeof payload.email === 'string' ? payload.email : undefined,
      };

      return true;
    } catch (error) {
      console.error(
        '[JWT VERIFICATION ERROR]',
        error instanceof Error ? error.message : error,
      );
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}