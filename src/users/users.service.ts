import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      include: { bookings: true, payments: true },
    });
    if (!users || users.length === 0)
      throw new NotFoundException('No users found');

    return users;
  }

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { bookings: true, payments: true },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: createUserDto.email },
          { phone: createUserDto.phone },
          { username: createUserDto.username },
        ],
      },
    });
    if (existingUser)
      throw new ConflictException(
        'User with the same email, phone, or usename already exists',
      );

    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    await this.getUser(id);

    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async deleteUser(id: string) {
    await this.getUser(id);

    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
