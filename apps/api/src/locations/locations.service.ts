import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { LocationQueryDto } from './dto/location-query.dto.js';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: LocationQueryDto) {
    const { search } = query;

    return this.prisma.location.findMany({
      where: {
        isActive: true,
        ...(search
          ? {
              city: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      select: {
        id: true,
        city: true,
        state: true,
        country: true,
        slug: true,
      },
      orderBy: {
        city: 'asc',
      },
    });
  }

  async findOne(slug: string) {
    const location = await this.prisma.location.findFirst({
      where: {
        slug,
        isActive: true,
      },
      select: {
        id: true,
        city: true,
        state: true,
        country: true,
        slug: true,
        services: {
          where: {
            isActive: true,
            service: {
              isActive: true,
            },
          },
          select: {
            service: {
              select: {
                id: true,
                name: true,
                slug: true,
                shortDescription: true,
                bookingType: true,
              },
            },
          },
        },
      },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return location;
  }
}