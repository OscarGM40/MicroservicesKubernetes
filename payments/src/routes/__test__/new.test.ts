
import request from 'supertest';

import { app } from './../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/Order';
import { OrderStatus } from '@oscargmk8s/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/Payment';
import { natsWrapper } from '../../nats-wrapper';

jest.mock('../../nats-wrapper');
// jest.mock('../../stripe');

describe('Testing payments Microservice', () => {

  it('should returns a 404 when purchasing an order that does not exists', async () => {

    await request(app)
      .post('/api/payments')
      // @ts-ignore
      .set('Cookie', global.signin())
      .send({
        token: 'askldjfsljdf',
        orderId: mongoose.Types.ObjectId().toHexString(),
      })
      .expect(404);
  })

  it('returns a 401 when purchasing an order that doesn\'t belong to the user', async () => {

    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      userId: mongoose.Types.ObjectId().toHexString(),
      version: 0,
      price: 20,
      status: OrderStatus.Created,
    });

    await order.save();

    await request(app)
      .post('/api/payments')
      // @ts-ignore
      .set('Cookie', global.signin())
      .send({
        token: 'askldjfsljdf',
        orderId: order.id,
      })
      .expect(401);
    
  })

  it('returns a 400 when purchasing an cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      price: 20,
      status: OrderStatus.Cancelled,
    });
    
    await order.save();

    await request(app)
      .post('/api/payments')
      // @ts-ignore
      .set('Cookie', global.signin(userId))
      .send({
        token: 'askldjfsljdf',
        orderId: order.id,
      })
      .expect(400);
  })

  it('returns a 201 with valid inputs',async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);

    const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      price,
      status: OrderStatus.Created,
    });
    
    await order.save();

    await request(app)
      .post('/api/payments')
      // @ts-ignore
      .set('Cookie', global.signin(userId))
      .send({
        token: 'tok_visa',
        orderId: order.id,
      })
      .expect(201);

      // usar 50 reduce las posibilidades de que no este mi cargo a casi 0
      const stripeCharges = await stripe.charges.list({ limit: 50 });
      const stripeCharge = stripeCharges.data.find(charge => {
        return charge.amount === price * 100;
      });

      expect(stripeCharge).toBeDefined();
      expect(stripeCharge!.currency).toEqual('usd');

      const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id,
      });

      expect(payment).not.toBeNull();
      
      // si hago el test contra la API estos expect contra el mock no me valen
    /* const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(20 * 100);
    expect(chargeOptions.currency).toEqual('usd'); */

    


  })
  
})
