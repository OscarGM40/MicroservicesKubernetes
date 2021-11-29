import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
   requireAuth,
   validateRequest,
   BadRequestError,
   NotFoundError,
   NotAuthorizedError,
   OrderStatus,
} from '@oscargmk8s/common';

import { Order } from '../models/Order'
import { stripe } from '../stripe';
import { Payment } from '../models/Payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.post('/api/payments',
   requireAuth,
   [
      body('token')
         .not()
         .isEmpty()
         .withMessage('Token is required'),
      body('orderId')
         .not()
         .isEmpty()
         .withMessage('OrderId is required'),
      body('orderId')
         .isMongoId()
         .withMessage('orderId field muste be a valid Id'),
   ],
   validateRequest,
   async (req: Request, res: Response) => {
      const { token, orderId } = req.body;

      const order = await Order.findById(orderId);

      if (!order) {
         throw new NotFoundError();
      }
      // recuerda que requireAuth me deja hacer req.currentUser! porque si pasó requireAuth hay un req.currentUser fijo.
      if (order.userId !== req.currentUser!.id) {
         throw new NotAuthorizedError();
      }

      if (order.status === OrderStatus.Cancelled) {
         throw new BadRequestError('Order already cancelled.Cannot pay for an cancelled Payment Order');
      }

      const charge = await stripe.charges.create({
         currency: 'usd',
         amount: order.price * 100,
         source: token,
         description: 'Charge for orderId: ${orderId}',
      });

      const payment = Payment.build({
         orderId: orderId,
         stripeId: charge.id
      });
      await payment.save();

      await new PaymentCreatedPublisher(natsWrapper.client).publish({
         id: payment.id,
         orderId: payment.orderId,
         stripeId: payment.stripeId,
      });

      res.status(201).send({
         id: payment.id,
         success: true
      });

   })

export { router as createChargeRouter };