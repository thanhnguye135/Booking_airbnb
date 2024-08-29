import {
  BadRequestException,
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  LoggerService,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { BookingEntity } from './entities/booking.entity';
import { PaymentsService } from 'src/payments/payments.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class BookingsService {
  private readonly context = BookingsService.name;

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getAllBookings() {
    const bookings = await this.prisma.booking.findMany();
    if (!bookings || bookings.length === 0)
      throw new NotFoundException('No bookings found');
    this.logger.log('Found bookings', BookingsService.name);
    return bookings;
  }

  async getBooking(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking)
      throw new NotFoundException(`Booking with ID ${id} not found`);

    return booking;
  }

  async createBooking(createBookingDto: CreateBookingDto, res: Response) {
    const { checkInDate, checkOutDate, homestayId, userId, totalPrice } =
      createBookingDto;
    try {
      const booking = await this.prisma.$transaction(async (prisma) => {
        const homeAvailable = await prisma.$queryRaw`
          SELECT *
          FROM public."HomeAvailable" 
          WHERE "homestayId" = CAST(${homestayId} AS TEXT)
          FOR UPDATE
        `;

        if (!homeAvailable[0]) {
          throw new NotFoundException('No matching HomeAvailable found.');
        }

        await prisma.$executeRaw`
          DELETE FROM public."HomeAvailable" 
          WHERE id = ${homeAvailable[0].id}
        `;

        return await prisma.$queryRaw`
          INSERT INTO public."Booking" (id, "checkInDate", "checkOutDate", "totalPrice", "userId", "homestayId", "updatedAt")
          VALUES (gen_random_uuid(),${checkInDate}, ${checkOutDate}, ${totalPrice}, ${userId}, ${homestayId}, now())
          RETURNING id, "checkInDate", "checkOutDate", "totalPrice", "userId", "homestayId", "updatedAt";
        `;
      });

      const sessionId = uuidv4();
      const cacheKey = `booking-session-${sessionId}`;
      const ttl = 5 * 60 * 1000;
      this.cacheManager.set(cacheKey, booking[0], ttl);

      const expirationDate = new Date();
      const timeZoneOffset = 7 * 60;
      expirationDate.setMinutes(
        expirationDate.getMinutes() + 5 + timeZoneOffset,
      );

      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: false,
        expires: expirationDate,
      });

      // console.log('Set-Cookie header:', res.getHeader('Set-Cookie'));

      return res.status(201).json(new BookingEntity(booking[0]));
    } catch (error) {
      this.logger.log(error);
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
