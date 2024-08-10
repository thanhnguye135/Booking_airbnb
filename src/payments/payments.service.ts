import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

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
}
