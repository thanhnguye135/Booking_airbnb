import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { HomestaysService } from './homestays.service';
import { HomestayEntity } from './entities/homestay.entity';
import { CreateHomestayDto } from './dtos/create-homestay.dto';
import { UpdateHomestayDto } from './dtos/update-homestay.dto';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('homestays')
@ApiTags('Homestays')
export class HomestaysController {
  constructor(private readonly homestaysService: HomestaysService) {}

  @Get()
  @CacheKey('all-homestays')
  @CacheTTL(60 * 1000)
  @ApiOkResponse({ status: 200, type: HomestayEntity, isArray: true })
  async getAll() {
    return this.homestaysService.getAllHomestays();
  }

  @Get('nearby')
  @CacheKey('homestays-filter-with-radius')
  @CacheTTL(60 * 1000)
  @ApiOperation({ summary: 'Get nearby homestays' })
  @ApiQuery({
    name: 'longitude',
    description: 'The longitude of the location',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'latitude',
    description: 'The latitude of the location',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'radius',
    description: 'The search radius in kilometers',
    required: true,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of nearby homestays',
    type: [HomestayEntity],
  })
  async getNearByHomestays(
    @Query('longitude') longitude: string,
    @Query('latitude') latitude: string,
    @Query('radius') radius: string,
  ) {
    return this.homestaysService.findNearByHomestays(
      +longitude,
      +latitude,
      +radius,
    );
  }

  @Get(':id')
  @CacheKey('one-homestay')
  @CacheTTL(60 * 1000)
  @ApiOkResponse({ status: 200, type: HomestayEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async get(@Param('id') id: string) {
    return this.homestaysService.getHomestay(id);
  }

  @Post()
  @ApiCreatedResponse({
    status: 201,
    type: HomestayEntity,
    isArray: false,
    description: 'Created Successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(@Body() createHomestayDto: CreateHomestayDto) {
    return this.homestaysService.createHomestay(createHomestayDto);
  }

  @Patch(':id')
  @ApiOkResponse({ status: 201, type: HomestayEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(
    @Param('id') id: string,
    @Body() updateHomestayDto: UpdateHomestayDto,
  ) {
    return this.homestaysService.updateHomestay(id, updateHomestayDto);
  }

  @Delete(':id')
  @ApiOkResponse({ status: 204, description: 'Deleted Successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async remove(@Param('id') id: string) {
    return this.homestaysService.deleteHomestay(id);
  }
}
