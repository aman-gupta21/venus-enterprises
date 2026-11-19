import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { ServicesService } from './services.service.js';
import { ServiceQueryDto } from './dto/service-query.dto.js';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all active services',
  })
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
  })
  @ApiQuery({
    name: 'location',
    required: false,
    description: 'Location slug, for example mumbai',
  })
  findAll(@Query() query: ServiceQueryDto) {
    return this.servicesService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({
    summary: 'Get service details by slug',
  })
  @ApiParam({
    name: 'slug',
    example: 'commercial-refurbishment',
  })
  findOne(@Param('slug') slug: string) {
    return this.servicesService.findOne(slug);
  }
}