import { OrderCreatedEvent, OrderStatus } from '@oscargmk8s/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/Ticket';

jest.mock('../../../nats-wrapper')

const setup = async () => {
   // create an instance of the listener
   const listener = new OrderCreatedListener(natsWrapper.client);
   // create and save a ticket
   const ticket = Ticket.build({
      title: 'concert',
      price: 99,
      userId: 'asdf',
   });
   await ticket.save();
   // create a fake data event
   const data: OrderCreatedEvent['data'] = {
      id: mongoose.Types.ObjectId().toHexString(),
      version: 0,
      status: OrderStatus.Created,
      userId: 'asldkfj',
      expiresAt: 'alskdfj',
      ticket: {
         id: ticket.id,
         price: ticket.price,
      }
   };
   // create a fake message object so I can call ack
   // @ts-ignore
      const msg:Message  = {
         ack: jest.fn()
   }
   return { listener, ticket, data, msg };
}


it('should set the userId of the ticket', async () => {
   const { listener,ticket, data, msg } = await setup();
   // call the onMessage function with the data object and the fake message object
   await listener.onMessage(data, msg);
   // write assertions to make sure a ticket was created(buscar uno con el id que me mandó el evento)
   const updatedTicket = await Ticket.findById(ticket.id);
   expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
   const { listener, data, msg } = await setup();
   
   // call the onMessage function with the data object and the fake message object
   await listener.onMessage(data, msg);
   
   // write assertions to make sure the ack function is called
   expect(msg.ack).toHaveBeenCalled();
})