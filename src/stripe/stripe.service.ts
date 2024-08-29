import { Inject, Injectable } from '@nestjs/common';
import { BookingEntity } from 'src/bookings/entities/booking.entity';
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

  async checkOutSession(booking) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Homestay Booking',
                description: `Booking for Homestay ID: ${booking.homestayId}`,
              },
              unit_amount: booking.totalPrice * 100, // amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url:
          'http://localhost:3000/stripe/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://localhost:3000/stripe/cancel',
        metadata: {
          bookingId: booking.id,
          userId: booking.userId,
          homestayId: booking.homestayId,
        },
      });

      console.log('Checkout session created:', session.url);
      return session.url; // Return the session URL to redirect the user
    } catch (error) {
      console.error('Error creating Checkout session:', error);
      throw error;
    }
  }

  async successPayment(res) {
    console.log(res);
  }
}
