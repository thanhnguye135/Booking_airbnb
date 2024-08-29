import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { PaymentEntity } from './entities/payment.entity';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Request } from 'express';
import { ChargePaymentDto } from './dtos/charge-payment.dto';

@Controller('payments')
@ApiTags('Payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @CacheKey('all-payments')
  @CacheTTL(60 * 1000)
  @ApiOkResponse({ status: 200, type: PaymentEntity, isArray: true })
  async getAll() {
    return this.paymentsService.getAllPayments();
  }

  @Get(':id')
  @CacheKey('one-payment')
  @CacheTTL(60 * 1000)
  @ApiOkResponse({ status: 200, type: PaymentEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async get(@Param('id') id: string) {
    return this.paymentsService.getPayment(id);
  }

  @Post()
  @ApiCreatedResponse({
    status: 201,
    type: PaymentEntity,
    isArray: false,
    description: 'Created Successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPayment(createPaymentDto);
  }

  @Patch(':id')
  @ApiOkResponse({ status: 201, type: PaymentEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.updatePayment(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOkResponse({ status: 204, description: 'Deleted Successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async remove(@Param('id') id: string) {
    return this.paymentsService.deletePayment(id);
  }

  @Post('charge')
  async charge(@Body() chargeDto: ChargePaymentDto, @Req() req: Request) {
    return this.paymentsService.processPayment(
      chargeDto.amount,
      chargeDto.currency,
      req,
    );
  }
}
