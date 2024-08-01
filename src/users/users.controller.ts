import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
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

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ status: 200, type: UserEntity, isArray: true })
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiOkResponse({ status: 200, type: UserEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getUser(@Param('id') id: string) {
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
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  @ApiOkResponse({ status: 201, type: UserEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async updateUser(@Param('id') id: string, updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ status: 204, description: 'Deleted Successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async removeUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
