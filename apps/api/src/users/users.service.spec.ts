import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  it('creates a default profile when one does not exist', async () => {
    const profile = {
      id: 'user-123',
      fullName: null,
      phone: null,
      role: 'CUSTOMER',
      isActive: true,
      createdAt: new Date(),
    };
    const upsert = vi.fn().mockResolvedValue(profile);
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: { profile: { upsert } },
        },
      ],
    }).compile();

    const service = moduleRef.get(UsersService);

    await expect(service.findOrCreateProfile('user-123')).resolves.toEqual(
      profile,
    );
    expect(upsert).toHaveBeenCalledWith({
      where: { id: 'user-123' },
      create: { id: 'user-123' },
      update: {},
      select: {
        id: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  });
});
