import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@Inject('STRIPE_API_KEY') private readonly apiKey: string) {
    this.stripe = new Stripe(this.apiKey, { apiVersion: '2024-06-20' });
  }

  async getProducts(): Promise<Stripe.Product[]> {
    const products = await this.stripe.products.list();

    return products.data;
  }

  async getCustomers() {
    const customers = await this.stripe.customers.list({});

    return customers.data;
  }

  async checkOutSession() {
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1Pk1mnKfOPPh1e1TuzKeNPBE',
          quantity: 30,
        },
      ],
      mode: 'payment',
      payment_intent_data: {
        setup_future_usage: 'on_session',
      },
      customer: 'cus_QbGtM91rXeQ6pD',
      success_url:
        'http://localhost:3000' +
        '/pay/success/checkout/session?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000' + '/pay/failed/checkout/session',
    });

    return session;
  }

  async successPayment(res) {
    console.log(res);
  }
}
