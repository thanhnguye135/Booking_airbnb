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

@Controller('payments')
@ApiTags('Payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOkResponse({ status: 200, type: PaymentEntity, isArray: true })
  async getAllUsers() {
    return this.paymentsService.getAllPayments();
  }

  @Get(':id')
  @ApiOkResponse({ status: 200, type: PaymentEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async getUser(@Param('id') id: string) {
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
  async createUser(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPayment(createPaymentDto);
  }

  @Patch(':id')
  @ApiOkResponse({ status: 201, type: PaymentEntity, isArray: false })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async updateUser(
    @Param('id') id: string,
    updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.updatePayment(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOkResponse({ status: 204, description: 'Deleted Successfully' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async removeUser(@Param('id') id: string) {
    return this.paymentsService.deletePayment(id);
  }
}
