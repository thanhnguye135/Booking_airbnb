import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { HomestaysService } from './homestays.service';
import { HomestayEntity } from './entities/homestay.entity';
import { CreateHomestayDto } from './dtos/create-homestay.dto';
import { UpdateHomestayDto } from './dtos/update-homestay.dto';

@Controller('homestays')
@ApiTags('Homestays')
export class HomestaysController {
  constructor(private readonly usersService: HomestaysService) {}

  @Get()
  @ApiOkResponse({ status: 200, type: HomestayEntity, isArray: true })
  async getAllUsers() {
    return this.usersService.getAllHomestays();
  }

  @Get(':id')
  @ApiOkResponse({ status: 200, type: HomestayEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getUser(@Param('id') id: string) {
    return this.usersService.getHomestay(id);
  }

  @Post()
  @ApiCreatedResponse({
    status: 201,
    type: HomestayEntity,
    isArray: false,
    description: 'Created Successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async createUser(@Body() createHomestayDto: CreateHomestayDto) {
    return this.usersService.createHomestay(createHomestayDto);
  }

  @Patch(':id')
  @ApiOkResponse({ status: 201, type: HomestayEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async updateUser(
    @Param('id') id: string,
    updateHomestayDto: UpdateHomestayDto,
  ) {
    return this.usersService.updateHomestay(id, updateHomestayDto);
  }

  @Delete(':id')
  @ApiOkResponse({ status: 204, description: 'Deleted Successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async removeUser(@Param('id') id: string) {
    return this.usersService.deleteHomestay(id);
  }
}
