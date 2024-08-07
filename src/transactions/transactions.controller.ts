import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { TransactionEntity } from './entities/transaction.entity';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { UpdateTransactionDto } from './dtos/update-transaction.dto';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('transactions')
@ApiTags('Transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @CacheKey('all-transactions')
  @CacheTTL(60 * 1000)
  @ApiOkResponse({ status: 200, type: TransactionEntity, isArray: true })
  async getAll() {
    return this.transactionsService.getAllTransactions();
  }

  @Get(':id')
  @CacheKey('one-transaction')
  @CacheTTL(60 * 1000)
  @ApiOkResponse({ status: 200, type: TransactionEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async get(@Param('id') id: string) {
    return this.transactionsService.getTransaction(id);
  }

  @Post()
  @ApiCreatedResponse({
    status: 201,
    type: TransactionEntity,
    isArray: false,
    description: 'Created Successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  @Patch(':id')
  @ApiOkResponse({ status: 201, type: TransactionEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.updateTransaction(id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOkResponse({ status: 204, description: 'Deleted Successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async remove(@Param('id') id: string) {
    return this.transactionsService.deleteTransaction(id);
  }
}
