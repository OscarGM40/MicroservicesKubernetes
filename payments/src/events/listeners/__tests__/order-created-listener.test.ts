import { OrderCreatedEvent, OrderStatus } from "@oscargmk8s/common"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose from 'mongoose';
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/Order";

jest.mock('../../../nats-wrapper')

const setup = async () => {
   const listener = new OrderCreatedListener(natsWrapper.client);

   const data: OrderCreatedEvent['data'] = {
      // parece que acepta con new y sin new
      id: mongoose.Types.ObjectId().toHexString(),
      version: 0,
      expiresAt: 'asdf',
      userId: 'asdf',
      status: OrderStatus.Created,
      ticket: {
         id: 'asdf',
         price: 10
      }
   }

   // @ts-ignore
   const msg:Message  = {
      ack: jest.fn()
   }

   return { listener, data, msg }

}

it('replicates the order info', async () => {
   const { listener, data, msg } = await setup();

   await listener.onMessage(data, msg);
   // busco la order por el id
   const order = await Order.findById(data.id);
   // y comparo la propiedad emitida contra la original
   expect(order!.price).toEqual(data.ticket.price);
})

it('acks the message', async () => {
   const { listener, data, msg } = await setup();

   await listener.onMessage(data, msg);

   expect(msg.ack).toHaveBeenCalled();
})