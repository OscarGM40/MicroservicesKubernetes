import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketUpdatedEvent } from '@oscargmk8s/common';
import { Ticket } from '../../models/Ticket';
import { queueGroupName } from './queue-group-name';


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
   readonly subject = Subjects.TicketUpdated;
   queueGroupName = queueGroupName;
   
   async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
      const ticket = await Ticket.findById(data.id);
   
      if (!ticket) {
         throw new Error('Ticket not found');
      }
   // el evento me mandará el nuevo price y title
      const { title, price } = data;
      ticket.set({ title, price });
      await ticket.save();
   
      msg.ack();
   }

}
