import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { StripeService } from 'src/stripe/stripe.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Request } from 'express';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getAllPayments() {
    const payments = await this.prisma.payment.findMany();
    if (!payments || payments.length === 0)
      throw new NotFoundException('No payments found');

    return payments;
  }

  async getPayment(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment)
      throw new NotFoundException(`Payment with ID ${id} not found`);

    return payment;
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const existingPayment = await this.prisma.payment.findFirst({
      where: { bookingId: createPaymentDto.bookingId },
    });
    if (existingPayment)
      throw new ConflictException(
        'Payment with the same bookingId already exists',
      );

    return await this.prisma.payment.create({
      data: createPaymentDto,
    });
  }

  async updatePayment(id: string, updatePaymentDto: UpdatePaymentDto) {
    await this.getPayment(id);

    try {
      return await this.prisma.payment.update({
        where: { id },
        data: updatePaymentDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async deletePayment(id: string) {
    await this.getPayment(id);

    try {
      await this.prisma.payment.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async processPayment(amount: number, currency: string, req: Request) {
    const session_id = req.cookies['sessionId'];
    const booking = await this.cacheManager.get(
      `booking-session-${session_id}`,
    );
    if (booking) {
      this.stripeService.checkOutSession(booking);
      this.logger.log('The booking has been success');
    } else {
      this.logger.log(
        'The booking has been canceled due to payment expired time',
        PaymentsService.name,
      );
    }
  }
}
