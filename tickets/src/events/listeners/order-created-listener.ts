

import { Listener, OrderCreatedEvent, Subjects } from "@oscargmk8s/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/Ticket";
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
   readonly subject = Subjects.OrderCreated;
   queueGroupName = queueGroupName;

   async onMessage(data: OrderCreatedEvent['data'], msg: Message){
      // find the ticket that the order is reserving
      const ticket = await Ticket.findById(data.ticket.id);
      // if no ticket, throw error
      if(!ticket){
         throw new Error('Ticket not found');
      }
      // mark the ticket as reserved by setting its orderId
      ticket.set({ orderId: data.id });
      // save the ticket
      await ticket.save();
      // ack the message
      msg.ack();
   }
}