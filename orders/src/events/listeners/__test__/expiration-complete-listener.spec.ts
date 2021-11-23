

import { Ticket } from "../../../models/Ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import mongoose from 'mongoose';
import { Order } from "../../../models/Order";
import { ExpirationCompleteEvent, OrderStatus } from '@oscargmk8s/common';
import { Message } from "node-nats-streaming";

jest.mock('../../../nats-wrapper')

const setup = async () => {
   const listener = new ExpirationCompleteListener(natsWrapper.client);

   const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20,
   });

   await ticket.save();

   const order = Order.build({
      status: OrderStatus.Created,
      userId: 'asdf',
      expiresAt: new Date(),
      ticket,
   });

   await order.save();

   const data: ExpirationCompleteEvent['data'] = {
      orderId: order.id,
   };

   // @ts-ignore
   const msg: Message = {
      ack: jest.fn()
   };

   return { listener, order, ticket, data, msg };

}

test('updates the order status to cancelled', async () => {
  const { listener, data, msg, ticket,order} = await setup();
   //  me traigo el setup y llamo al onMessage
  await listener.onMessage(data, msg);
  // simplemente busco la orden y compruebo su status
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('emit an OrderCancelled event', async () => {
  const { listener, data, msg, ticket,order} = await setup();

   await listener.onMessage(data, msg);
   // debo esperar que se haya llamado al publish,no?
   expect(natsWrapper.client.publish).toHaveBeenCalled();
   // y que se haya llamado con el id exacto de la Order
   const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

   expect(eventData.id).toEqual(order.id);

});

it('acks the message',async () => {
  const { listener, data, msg, ticket,order} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();

}); 