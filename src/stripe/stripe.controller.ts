import { Controller, Get, Query, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Response } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('products')
  async getProducts() {
    return await this.stripeService.getProducts();
  }

  @Get('customers')
  async getCustomers() {
    return await this.stripeService.getCustomers();
  }

  @Get('success')
  handleSuccess(@Query('session_id') sessionId: string, @Res() res: Response) {
    res.json({ msg: 'Payment Successful', sessionId });
  }

  @Get('cancel')
  handleCancel(@Res() res: Response) {
    res.json({ msg: 'Payment Canceled' });
  }
}
