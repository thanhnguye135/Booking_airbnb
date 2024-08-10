import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomeAvailableDto } from './dtos/create-home-available.dto';
import { UpdateHomeAvailableDto } from './dtos/update-home-available.dto';

@Injectable()
export class HomeAvailablesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllHomeAvailables() {
    const homeAvailables = await this.prisma.homeAvailable.findMany();
    if (!homeAvailables || homeAvailables.length === 0)
      throw new NotFoundException('No homes available found');

    return homeAvailables;
  }

  async getHomeAvailable(id: string) {
    const homeAvailable = await this.prisma.homeAvailable.findUnique({
      where: { id },
    });
    if (!homeAvailable)
      throw new NotFoundException(`Home available with ID ${id} not found`);

    return homeAvailable;
  }

  async createHomeAvailable(createHomeAvailableDto: CreateHomeAvailableDto) {
    const { homestayId, availableFrom, availableTo } = createHomeAvailableDto;
    if (availableFrom >= availableTo) {
      throw new BadRequestException('availableFrom must be before availableTo');
    }

    const overlappingAvailability = await this.prisma.homeAvailable.findFirst({
      where: {
        homestayId,
        AND: [
          {
            availableFrom: { lte: availableTo },
          },
          {
            availableTo: { gte: availableFrom },
          },
        ],
      },
    });

    if (overlappingAvailability) {
      throw new ConflictException(
        'The provided dates overlap with an existing availability for this homestay',
      );
    }

    try {
      return await this.prisma.homeAvailable.create({
        data: createHomeAvailableDto,
      });
    } catch (error) {
      console.log(error);
      if (error.code === 'P2003') {
        throw new ConflictException('Invalid homestay ID provided');
      } else {
        throw new InternalServerErrorException('An unexpected error occured');
      }
    }
  }

  async updateHomeAvailable(
    id: string,
    updateHomeAvailableDto: UpdateHomeAvailableDto,
  ) {
    await this.getHomeAvailable(id);

    try {
      return await this.prisma.homeAvailable.update({
        where: { id },
        data: updateHomeAvailableDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occured');
    }
  }

  async deleteHomeAvailable(id: string) {
    await this.getHomeAvailable(id);

    try {
      await this.prisma.homeAvailable.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occured');
    }
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
    if (!availableHomes || availableHomes.length === 0)
      throw new NotFoundException('No available homes found with dates');

    return availableHomes;
  }
}
