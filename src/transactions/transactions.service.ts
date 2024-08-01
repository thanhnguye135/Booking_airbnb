import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTransactions() {
    return await this.prisma.transaction.findMany();
  }

  async getTransaction(id: string) {
    return await this.prisma.transaction.findUnique({ where: { id } });
  }

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    return await this.prisma.transaction.create({
      data: createTransactionDto,
    });
  }

  async updateTransaction(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  async deleteTransaction(id: string) {
    return await this.prisma.transaction.delete({ where: { id } });
  }
}
