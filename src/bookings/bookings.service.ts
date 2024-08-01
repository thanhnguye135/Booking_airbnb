import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllBookings() {
    return await this.prisma.booking.findMany();
  }

  async getBooking(id: string) {
    return await this.prisma.booking.findUnique({ where: { id } });
  }

  async createBooking(createBookingDto: CreateBookingDto) {
    return await this.prisma.booking.create({
      data: createBookingDto,
    });
  }

  async updateBooking(id: string, updateBookingDto: UpdateBookingDto) {
    return await this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
    });
  }

  async deleteBooking(id: string) {
    return await this.prisma.booking.delete({ where: { id } });
  }
}
