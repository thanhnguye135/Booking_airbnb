import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { HomeAvailableEntity } from './entities/home-available.entity';
import { CreateHomeAvailableDto } from './dtos/create-home-available.dto';
import { UpdateHomeAvailableDto } from './dtos/update-home-available.dto';
import { HomeAvailablesService } from './home-availables.service';

@Controller('home-availables')
@ApiTags('HomeAvailables')
export class HomeAvailablesController {
  constructor(private readonly homeAvailablesService: HomeAvailablesService) {}

  @Get()
  @ApiOkResponse({ status: 200, type: HomeAvailableEntity, isArray: true })
  async getAllUsers() {
    return this.homeAvailablesService.getAllHomeAvailables();
  }

  @Get(':id')
  @ApiOkResponse({ status: 200, type: HomeAvailableEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getUser(@Param('id') id: string) {
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
  async createUser(@Body() createHomeAvailableDto: CreateHomeAvailableDto) {
    return this.homeAvailablesService.createHomeAvailable(
      createHomeAvailableDto,
    );
  }

  @Patch(':id')
  @ApiOkResponse({ status: 201, type: HomeAvailableEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async updateUser(
    @Param('id') id: string,
    updateHomeAvailableDto: UpdateHomeAvailableDto,
  ) {
    return this.homeAvailablesService.updateHomeAvailable(
      id,
      updateHomeAvailableDto,
    );
  }

  @Delete(':id')
  @ApiOkResponse({ status: 204, description: 'Deleted Successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async removeUser(@Param('id') id: string) {
    return this.homeAvailablesService.deleteHomeAvailable(id);
  }
}
