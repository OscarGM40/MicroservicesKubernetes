import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/Order';
import { Ticket } from '../../models/Ticket';
import { natsWrapper } from '../../nats-wrapper';

jest.mock('../../nats-wrapper')

const ticketId = mongoose.Types.ObjectId();

const newTicket = {
   id: "asdf",
   title: 'concert',
   price:20,
}

it('returns an error if the ticket does not exist', async () => {
   // desde la version 6 de mongoose es con 'new mongoose.Types.ObjectId()'

   await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId })
      .expect(404);

})

it('returns an error if the ticket is already reserved', async () => {
   const ticket = Ticket.build(newTicket);
   await ticket.save();

   const order = Order.build({
      ticket,
      userId: 'asdf',
      status: OrderStatus.Created,
      expiresAt: new Date()
   });
   await order.save();

   await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id })
      .expect(400);
})

it('reserves a ticket', async () => {
   const ticket = Ticket.build({
      id:'sdjflk',
      title: 'concert',
      price: 20
   });
   await ticket.save();

   await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);
})

it('emits an order created event', async () => {  
   const ticket = Ticket.build({
      id:'slkdfj',
      title: 'concert',
      price: 20
   });
   await ticket.save(); 

   await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);

   expect(natsWrapper.client.publish).toHaveBeenCalled();

});

