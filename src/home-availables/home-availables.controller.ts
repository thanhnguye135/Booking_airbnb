import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { HomeAvailableEntity } from './entities/home-available.entity';
import { CreateHomeAvailableDto } from './dtos/create-home-available.dto';
import { UpdateHomeAvailableDto } from './dtos/update-home-available.dto';
import { HomeAvailablesService } from './home-availables.service';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('home-availables')
@ApiTags('HomeAvailables')
export class HomeAvailablesController {
  constructor(private readonly homeAvailablesService: HomeAvailablesService) {}

  @Get()
  @CacheKey('all-home-available')
  @CacheTTL(60 * 1000)
  @ApiOkResponse({ status: 200, type: HomeAvailableEntity, isArray: true })
  async getAll() {
    return this.homeAvailablesService.getAllHomeAvailables();
  }

  @Get('home-available')
  @CacheKey('one-home-available-filter-with-date')
  @CacheTTL(60 * 1000)
  @ApiQuery({ name: 'startDate', type: Date, example: '2024-08-04T00:00:00Z' })
  @ApiQuery({ name: 'endDate', type: Date, example: '2024-08-05T00:00:00Z' })
  async getHomeAvailables(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return await this.homeAvailablesService.getAvailableHomes(
      startDate,
      endDate,
    );
  }

  @Get(':id')
  @CacheKey('one-home-available')
  @CacheTTL(60 * 1000)
  @ApiOkResponse({ status: 200, type: HomeAvailableEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async get(@Param('id') id: string) {
    return this.homeAvailablesService.getHomeAvailable(id);
  }

  @Post()
  @ApiCreatedResponse({
    status: 201,
    type: HomeAvailableEntity,
    isArray: false,
    description: 'Created Successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(@Body() createHomeAvailableDto: CreateHomeAvailableDto) {
    return this.homeAvailablesService.createHomeAvailable(
      createHomeAvailableDto,
    );
  }

  @Patch(':id')
  @ApiOkResponse({ status: 201, type: HomeAvailableEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(
    @Param('id') id: string,
    @Body() updateHomeAvailableDto: UpdateHomeAvailableDto,
  ) {
    return this.homeAvailablesService.updateHomeAvailable(
      id,
      updateHomeAvailableDto,
    );
  }

  @Delete(':id')
  @ApiOkResponse({ status: 204, description: 'Deleted Successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async remove(@Param('id') id: string) {
    return this.homeAvailablesService.deleteHomeAvailable(id);
  }
}
