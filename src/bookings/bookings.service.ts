import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { BookingEntity } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllBookings() {
    const bookings = await this.prisma.booking.findMany();
    if (!bookings || bookings.length === 0)
      throw new NotFoundException('No bookings found');

    return bookings;
  }

  async getBooking(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking)
      throw new NotFoundException(`Booking with ID ${id} not found`);

    return booking;
  }

  async createBooking(createBookingDto: CreateBookingDto) {
    const { checkInDate, checkOutDate, homestayId, userId, totalPrice } =
      createBookingDto;
    try {
      const booking = await this.prisma.$transaction(async (prisma) => {
        const homeAvailableId = await prisma.$queryRaw<{ id: string }[]>`
          SELECT id 
          FROM public."HomeAvailable" 
          WHERE "homestayId" = CAST(${homestayId} AS TEXT)
          FOR UPDATE
        `;

        if (homeAvailableId.length === 0) {
          throw new NotFoundException('No matching HomeAvailable found.');
        }

        await prisma.$executeRaw`
          DELETE FROM public."HomeAvailable" 
          WHERE id = ${homeAvailableId[0].id}
        `;

        return await prisma.$queryRaw`
          INSERT INTO public."Booking" (id, "checkInDate", "checkOutDate", "totalPrice", "userId", "homestayId", "updatedAt")
          VALUES (gen_random_uuid(),${checkInDate}, ${checkOutDate}, ${totalPrice}, ${userId}, ${homestayId}, now())
          RETURNING id, "checkInDate", "checkOutDate", "totalPrice", "userId", "homestayId", "updatedAt";
        `;
      });
      return new BookingEntity(booking[0]);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async updateBooking(id: string, updateBookingDto: UpdateBookingDto) {
    await this.getBooking(id);

    try {
      return await this.prisma.booking.update({
        where: { id },
        data: updateBookingDto,
      });
    } catch (error) {
      throw new BadRequestException('Invalid data provided');
    }
  }

  async deleteBooking(id: string) {
    await this.getBooking(id);

    try {
      await this.prisma.booking.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete booking');
    }
  }
}
