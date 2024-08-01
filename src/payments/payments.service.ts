import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllPayments() {
    return await this.prisma.payment.findMany();
  }

  async getPayment(id: string) {
    return await this.prisma.payment.findUnique({ where: { id } });
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    return await this.prisma.payment.create({
      data: createPaymentDto,
    });
  }

  async updatePayment(id: string, updatePaymentDto: UpdatePaymentDto) {
    return await this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto,
    });
  }

  async deletePayment(id: string) {
    return await this.prisma.payment.delete({ where: { id } });
  }
}
