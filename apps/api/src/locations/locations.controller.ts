import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { LocationsService } from './locations.service.js';
import { LocationQueryDto } from './dto/location-query.dto.js';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all active locations' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search locations by city',
  })
  findAll(@Query() query: LocationQueryDto) {
    return this.locationsService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get location details and available services' })
  @ApiParam({ name: 'slug', example: 'mumbai' })
  findOne(@Param('slug') slug: string) {
    return this.locationsService.findOne(slug);
  }
}