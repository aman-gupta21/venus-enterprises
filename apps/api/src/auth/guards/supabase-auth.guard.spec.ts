import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import type { ExecutionContext } from '@nestjs/common';
import { jwtVerify } from 'jose';
import { SupabaseAuthGuard } from './supabase-auth.guard.js';

const { createRemoteJWKSetMock, jwtVerifyMock } = vi.hoisted(() => ({
  createRemoteJWKSetMock: vi.fn(),
  jwtVerifyMock: vi.fn(),
}));

vi.mock('jose', () => ({
  createRemoteJWKSet: createRemoteJWKSetMock,
  jwtVerify: jwtVerifyMock,
}));

describe('SupabaseAuthGuard', () => {
  let guard: SupabaseAuthGuard;

  beforeEach(async () => {
    vi.clearAllMocks();
    createRemoteJWKSetMock.mockReturnValue(vi.fn());

    const moduleRef = await Test.createTestingModule({
      providers: [
        SupabaseAuthGuard,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) =>
              key === 'SUPABASE_URL' ? 'https://example.supabase.co/' : undefined,
          },
        },
      ],
    }).compile();

    guard = moduleRef.get(SupabaseAuthGuard);
  });

  function createContext(authorization?: string) {
    const request: { headers: { authorization?: string }; user?: object } = {
      headers: { authorization },
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    return { context, request };
  }

  it('rejects requests without a bearer token', async () => {
    const { context } = createContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      'Access token is required',
    );
    expect(jwtVerify).not.toHaveBeenCalled();
  });

  it('sets the authenticated user from verified token claims', async () => {
    jwtVerifyMock.mockResolvedValue({
      payload: {
        sub: 'user-123',
        role: 'authenticated',
        email: 'user@example.com',
      },
    });
    const { context, request } = createContext('Bearer valid-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);

    expect(jwtVerify).toHaveBeenCalledWith(
      'valid-token',
      expect.any(Function),
      {
        issuer: 'https://example.supabase.co/auth/v1',
        audience: 'authenticated',
      },
    );
    expect(request.user).toEqual({
      id: 'user-123',
      role: 'authenticated',
      email: 'user@example.com',
    });
  });

  it('rejects tokens that fail verification', async () => {
    jwtVerifyMock.mockRejectedValue(new Error('Invalid signature'));
    const { context } = createContext('Bearer invalid-token');

    await expect(guard.canActivate(context)).rejects.toThrow(
      'Invalid or expired access token',
    );
  });
});
