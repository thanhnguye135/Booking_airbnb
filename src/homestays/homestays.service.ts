import { Injectable } from '@nestjs/common';
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
    return new HomestayEntity(homestay[0]);
  }

  async createHomestay(createHomestayDto: CreateHomestayDto) {
    const { name, description, longitude, latitude, pricePerNight } =
      createHomestayDto;
    const result = await this.prisma.$executeRaw`INSERT INTO public."Homestay" (
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
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
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

    return new HomestayEntity(result[0]);
  }

  async updateHomestay(id: string, updateHomestayDto: UpdateHomestayDto) {
    return await this.prisma.homestay.update({
      where: { id },
      data: updateHomestayDto,
    });
  }

  async deleteHomestay(id: string) {
    const homestay = await this.prisma.$queryRaw<HomestayRaw[]>`
      SELECT id, name, description, ST_X(coordinates) AS longitude, ST_Y(coordinates) AS latitude, "pricePerNight", "createdAt", "updatedAt"
      FROM public."Homestay"
      WHERE id = ${id}
    `;

    await this.prisma.$executeRaw`
      DELETE FROM public."Homestay"
      WHERE id = ${id}
    `;

    return new HomestayEntity(homestay[0]);
  }

  async findNearByHomestays(
    longitude: number,
    latitude: number,
    radius: number,
  ) {
    const homestays = await this.prisma.$queryRaw<HomestayRaw[]>`
      SELECT id, name, description, ST_X(coordinates) AS longitude, ST_Y(coordinates) AS latitude, "pricePerNight", "createdAt", "updatedAt",
             ST_Distance(
               ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
               ST_SetSRID(coordinates, 4326)::geography
             ) AS distance
      FROM public."Homestay"
      WHERE ST_Distance(
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
        ST_SetSRID(coordinates, 4326)::geography
      ) < ${radius}
    `;

    return homestays.map((homestay) => new HomestayEntity(homestay));
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
