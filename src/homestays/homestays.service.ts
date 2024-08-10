import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateHomestayDto } from './dtos/create-homestay.dto';
import { UpdateHomestayDto } from './dtos/update-homestay.dto';
import { HomestayEntity } from './entities/homestay.entity';

@Injectable()
export class HomestaysService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllHomestays() {
    const homestays = await this.prisma.$queryRaw<
      HomestayRaw[]
    >`SELECT id, name, description, ST_X(coordinates) AS longitude, ST_Y(coordinates) AS latitude, "pricePerNight", "createdAt", "updatedAt" FROM public."Homestay"`;
    if (!homestays || homestays.length === 0)
      throw new NotFoundException('No homestays found');

    return homestays.map(
      (homestay) =>
        new HomestayEntity({
          id: homestay.id,
          name: homestay.name,
          description: homestay.description,
          latitude: homestay.latitude,
          longitude: homestay.longitude,
          pricePerNight: homestay.pricePerNight,
          createdAt: homestay.createdAt,
          updatedAt: homestay.updatedAt,
        }),
    );
  }

  async getHomestay(id: string) {
    const homestay = await this.prisma.$queryRaw<HomestayRaw[]>`
      SELECT id, name, description, ST_X(coordinates) AS longitude, ST_Y(coordinates) AS latitude, "pricePerNight", "createdAt", "updatedAt"
      FROM public."Homestay"
      WHERE id = ${id}
    `;
    if (!homestay[0])
      throw new NotFoundException(`Homestay with ID ${id} not found`);

    return new HomestayEntity(homestay[0]);
  }

  async createHomestay(createHomestayDto: CreateHomestayDto) {
    const { name, description, longitude, latitude, pricePerNight } =
      createHomestayDto;
    const existingHomestay = await this.prisma.$queryRaw<HomestayRaw[]>`
      SELECT id, name, description, ST_X(coordinates) AS longitude, ST_Y(coordinates) AS latitude, "pricePerNight", "createdAt", "updatedAt"
      FROM public."Homestay"
      WHERE ST_DWithin(coordinates, ST_SetSRID(ST_Point(${longitude}, ${latitude}), 4326), 0.1)
    `;

    if (existingHomestay[0])
      throw new ConflictException(
        'Homestay with the same longitude, latitude already exists',
      );

    const result = await this.prisma.$queryRaw`INSERT INTO public."Homestay" (
        id,
        name,
        description,
        coordinates,
        "pricePerNight",
        "createdAt",
        "updatedAt"
      ) VALUES (
        gen_random_uuid(),
        ${name},
        ${description},
        ST_SetSRID(ST_Point(${longitude}, ${latitude}), 4326),
        ${pricePerNight},
        NOW(),
        NOW()
      ) RETURNING
        id,
        name,
        description,
        ST_X(coordinates) AS longitude,
        ST_Y(coordinates) AS latitude,
        "pricePerNight",
        "createdAt",
        "updatedAt";`;

    return new HomestayEntity({
      id: result[0].id,
      name: result[0].name,
      description: result[0].description,
      latitude: result[0].latitude,
      longitude: result[0].longitude,
      pricePerNight: result[0].pricePerNight,
      createdAt: result[0].createdAt,
      updatedAt: result[0].updatedAt,
    });
  }

  async updateHomestay(id: string, updateHomestayDto: UpdateHomestayDto) {
    await this.getHomestay(id);

    try {
      return await this.prisma.homestay.update({
        where: { id },
        data: updateHomestayDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async deleteHomestay(id: string) {
    await this.getHomestay(id);

    try {
      await this.prisma.$executeRaw`
      DELETE FROM public."Homestay"
      WHERE id = ${id}
    `;
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async findNearByHomestays(
    longitude: number,
    latitude: number,
    radius: number,
  ) {
    const homestays = await this.prisma.$queryRaw<HomestayRaw[]>`
      SELECT id, name, description, ST_X(coordinates) AS longitude, ST_Y(coordinates) AS latitude, "pricePerNight", "createdAt", "updatedAt"
      FROM public."Homestay"
      WHERE ST_DWithin(coordinates, ST_SetSRID(ST_Point(${longitude}, ${latitude}), 4326), ${radius})
    `;
    if (!homestays || homestays.length === 0)
      throw new NotFoundException(
        `No homestays found with longitude: ${longitude}, latitude: ${latitude}, and radius: ${radius}`,
      );

    return homestays.map(
      (homestay) =>
        new HomestayEntity({
          id: homestay.id,
          name: homestay.name,
          description: homestay.description,
          latitude: homestay.latitude,
          longitude: homestay.longitude,
          pricePerNight: homestay.pricePerNight,
          createdAt: homestay.createdAt,
          updatedAt: homestay.updatedAt,
        }),
    );
  }
}

type HomestayRaw = {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  pricePerNight: number;
  createdAt: Date;
  updatedAt: Date;
};
