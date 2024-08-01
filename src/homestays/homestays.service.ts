import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomestayDto } from './dtos/create-homestay.dto';
import { UpdateHomestayDto } from './dtos/update-homestay.dto';

@Injectable()
export class HomestaysService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllHomestays() {
    return await this.prisma.homestay.findMany();
  }

  async getHomestay(id: string) {
    return await this.prisma.homestay.findUnique({ where: { id } });
  }

  async createHomestay(createHomestayDto: CreateHomestayDto) {
    return await this.prisma.homestay.create({
      data: createHomestayDto,
    });
  }

  async updateHomestay(id: string, updateHomestayDto: UpdateHomestayDto) {
    return await this.prisma.homestay.update({
      where: { id },
      data: updateHomestayDto,
    });
  }

  async deleteHomestay(id: string) {
    return await this.prisma.homestay.delete({ where: { id } });
  }
}
