import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';
import {
  ApiOkResponse,
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @CacheKey('all-users')
  @CacheTTL(60 * 1000)
  @ApiOkResponse({ status: 200, type: UserEntity, isArray: true })
  async getAll() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @CacheKey('one-user')
  @CacheTTL(60 * 1000)
  @ApiOkResponse({ status: 200, type: UserEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async get(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Post()
  @ApiCreatedResponse({
    status: 201,
    type: UserEntity,
    isArray: false,
    description: 'Created Successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  @ApiOkResponse({ status: 201, type: UserEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ status: 204, description: 'Deleted Successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
