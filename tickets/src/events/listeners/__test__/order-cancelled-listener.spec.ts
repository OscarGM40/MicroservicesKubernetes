import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/Ticket';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderStatus, OrderCancelledEvent } from '@oscargmk8s/common';

jest.mock('../../../nats-wrapper')

const setup = async () => {
   // create an instance of the listener
   const listener = new OrderCancelledListener(natsWrapper.client);

   // create and save a ticket
   const orderId = new mongoose.Types.ObjectId().toHexString();

   const ticket = Ticket.build({
      title: 'concert',
      price: 99,
      userId: 'asdf',
   });

   ticket.set({ orderId });
   await ticket.save();

   // create a fake data event
   const data: OrderCancelledEvent['data'] = {
      id: mongoose.Types.ObjectId().toHexString(),
      version: 0,
      ticket: {
         id: ticket.id,
      }
   };
   // create a fake message object so I can call ack
   // @ts-ignore
   const msg: Message = {
      ack: jest.fn()
   }
   return { listener, ticket, orderId, data, msg };
}


it('updates the ticket,publishes an event and acks the message', async () => {
   const { listener, ticket, orderId, data, msg } = await setup();

   await listener.onMessage(data, msg);

   const updatedTicket = await Ticket.findById(ticket.id);
   expect(updatedTicket!.orderId).toBe(undefined);
   expect(updatedTicket!.orderId).not.toBeDefined();

   expect(msg.ack).toHaveBeenCalled();

   expect(natsWrapper.client.publish).toHaveBeenCalled();

});


