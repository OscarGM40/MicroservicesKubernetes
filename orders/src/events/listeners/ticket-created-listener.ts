

import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from '@oscargmk8s/common';
import { Ticket } from '../../models/Ticket';
import { queueGroupName } from './queue-group-name';


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
   readonly subject = Subjects.TicketCreated;
   queueGroupName = queueGroupName;

   async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
      const { id, title, price } = data;
      // console.log(data,'data para crear en el Order')
      const ticket = Ticket.build({
         id,
         title,
         price,
      });

      await ticket.save();
      // console.log(await Ticket.findById(data.id),'console');
      msg.ack();
   }

}
