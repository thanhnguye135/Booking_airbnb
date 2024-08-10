import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTransactions() {
    const transactions = await this.prisma.transaction.findMany();
    if (!transactions || transactions.length === 0)
      throw new NotFoundException('No transactions found');

    return transactions;
  }

  async getTransaction(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction)
      throw new NotFoundException(`Transaction with ID ${id} not found`);

    return transaction;
  }

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const existingTransaction = await this.prisma.transaction.findFirst({
      where: { paymentId: createTransactionDto.paymentId },
    });
    if (existingTransaction)
      throw new ConflictException(
        'Transaction with the same paymentId already exists',
      );

    return await this.prisma.transaction.create({
      data: createTransactionDto,
    });
  }

  async updateTransaction(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    await this.getTransaction(id);

    try {
      return await this.prisma.transaction.update({
        where: { id },
        data: updateTransactionDto,
      });
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async deleteTransaction(id: string) {
    await this.getTransaction(id);

    try {
      await this.prisma.transaction.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
}
