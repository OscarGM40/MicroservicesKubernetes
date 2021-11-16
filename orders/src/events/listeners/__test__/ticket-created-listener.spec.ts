import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@oscargmk8s/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/Ticket';

jest.mock('../../../nats-wrapper')

const setup = async () => {
   // create an instance of the listener
   const listener = new TicketCreatedListener(natsWrapper.client);
   // create a fake data event
   const data: TicketCreatedEvent['data'] = {
      version: 0,
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 10,
      userId: new mongoose.Types.ObjectId().toHexString()
   };

   // create a fake message object so I can call ack
   // @ts-ignore
      const msg:Message  = {
         ack: jest.fn()
   }
   return { listener, data, msg };
}


it('creates and saves a ticket', async () => {
   const { listener, data, msg } = await setup();
   // call the onMessage function with the data object and the fake message object
   await listener.onMessage(data, msg);
   // write assertions to make sure a ticket was created(buscar uno con el id que me mandó el evento)
   const ticket = await Ticket.findById(data.id);
   
   expect(ticket).toBeDefined();
   expect(ticket!.title).toEqual(data.title);
   expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
   const { listener, data, msg } = await setup();
   
   // call the onMessage function with the data object and the fake message object
   await listener.onMessage(data, msg);
   
   // write assertions to make sure the ack function is called
   expect(msg.ack).toHaveBeenCalled();
})