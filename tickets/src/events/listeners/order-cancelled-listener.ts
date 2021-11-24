
import { Listener, OrderCancelledEvent, Subjects } from '@oscargmk8s/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/Ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
   readonly subject = Subjects.OrderCancelled;
   queueGroupName = queueGroupName;

   async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
      // data es la orden luego es data.ticket.id
      const ticket = await Ticket.findById(data.ticket.id);

      if (!ticket) {
         throw new Error('Ticket not found');
      }
      // no usar null con TS,siempre undefined para eliminar un field
      ticket.set({ orderId: undefined });
      await ticket.save();
      // console.log(ticket,'ticket tras saving in Order DB y que será publicado')

      await new TicketUpdatedPublisher(this.client).publish({
         id: ticket.id,
         orderId: ticket.orderId,
         price: ticket.price,
         title: ticket.title,
         userId: ticket.userId,
         version: ticket.version,
      });

      msg.ack();
   }
}