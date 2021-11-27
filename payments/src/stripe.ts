
import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.STRIPE_KEY!, {
    apiVersion: '2020-08-27', // usar la que me sugiera stripe
}); 