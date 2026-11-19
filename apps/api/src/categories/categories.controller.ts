import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { CategoriesService } from './categories.service.js';
import { CategoryQueryDto } from './dto/category-query.dto.js';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active categories' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search categories by name',
  })
  findAll(@Query() query: CategoryQueryDto) {
    return this.categoriesService.findAll(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category details by slug' })
  @ApiParam({ name: 'slug', example: 'design-build' })
  async findOne(@Param('slug') slug: string) {
    const category = await this.categoriesService.findOne(slug);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}