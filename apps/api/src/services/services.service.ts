import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { ServiceQueryDto } from './dto/service-query.dto.js';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ServiceQueryDto) {
    const { search, categoryId, location } = query;

    return this.prisma.service.findMany({
      where: {
        isActive: true,

        ...(search && {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        }),

        ...(categoryId && {
          categoryId,
        }),

        ...(location && {
          locations: {
            some: {
              isActive: true,
              location: {
                slug: location,
                isActive: true,
              },
            },
          },
        }),
      },

      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        description: true,
        imageUrl: true,
        bookingType: true,
        basePrice: true,
        currency: true,
        durationMinutes: true,

        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        locations: {
          where: {
            isActive: true,
            location: {
              isActive: true,
            },
          },
          select: {
            location: {
              select: {
                id: true,
                city: true,
                state: true,
                slug: true,
              },
            },
          },
        },
      },

      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async findOne(slug: string) {
    const service = await this.prisma.service.findFirst({
      where: {
        slug,
        isActive: true,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        description: true,
        imageUrl: true,
        bookingType: true,
        basePrice: true,
        currency: true,
        durationMinutes: true,

        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },

        locations: {
          where: {
            isActive: true,
            location: {
              isActive: true,
            },
          },
          select: {
            location: {
              select: {
                id: true,
                city: true,
                state: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }
}