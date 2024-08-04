import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeAvailableDto } from './dtos/create-home-available.dto';
import { UpdateHomeAvailableDto } from './dtos/update-home-available.dto';

@Injectable()
export class HomeAvailablesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllHomeAvailables() {
    return await this.prisma.homeAvailable.findMany();
  }

  async getHomeAvailable(id: string) {
    return await this.prisma.homeAvailable.findUnique({ where: { id } });
  }

  async createHomeAvailable(createHomeAvailableDto: CreateHomeAvailableDto) {
    return await this.prisma.homeAvailable.create({
      data: createHomeAvailableDto,
    });
  }

  async updateHomeAvailable(
    id: string,
    updateHomeAvailableDto: UpdateHomeAvailableDto,
  ) {
    return await this.prisma.homeAvailable.update({
      where: { id },
      data: updateHomeAvailableDto,
    });
  }

  async deleteHomeAvailable(id: string) {
    return await this.prisma.homeAvailable.delete({ where: { id } });
  }

  async getAvailableHomes(startDate: Date, endDate: Date) {
    const availableHomes = await this.prisma.homeAvailable.findMany({
      where: {
        AND: [
          {
            availableFrom: { lt: endDate },
          },
          {
            availableTo: { gt: startDate },
          },
        ],
      },
      include: { homestay: true },
    });

    return availableHomes;
  }
}
