import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service.js';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string, fallback?: string) =>
              key === 'DATABASE_URL'
                ? 'postgresql://postgres:postgres@localhost:5432/test_db'
                : fallback,
            getOrThrow: (key: string) => {
              if (key === 'DATABASE_URL') {
                return 'postgresql://postgres:postgres@localhost:5432/test_db';
              }
              throw new Error(`Missing config: ${key}`);
            },
          },
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
