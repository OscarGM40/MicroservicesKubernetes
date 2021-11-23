import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketUpdatedEvent } from '@oscargmk8s/common';
import { Ticket } from '../../models/Ticket';
import { queueGroupName } from './queue-group-name';


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
   readonly subject = Subjects.TicketUpdated;
   queueGroupName = queueGroupName;
   
   async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
      // const ticket = await Ticket.findById(data.id);
      console.log(data,'data')
      const tickets = await Ticket.find({})
      console.log(tickets,'tickets')
      const ticket = await Ticket.findByEvent(data) ;
      console.log(ticket,'ticket tras findByEvent')
      
      if (!ticket) {
         throw new Error('Ticket not found');
      }
      // el evento me mandará el nuevo price y title
      const { title, price } = data;
      ticket.set({ title, price });
      await ticket.save();
      console.log(ticket,'ticket tras saving in Order DB')

   
      msg.ack();
   }

}
