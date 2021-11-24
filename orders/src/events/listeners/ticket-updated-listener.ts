import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketUpdatedEvent } from '@oscargmk8s/common';
import { Ticket } from '../../models/Ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
   readonly subject = Subjects.TicketUpdated;
   queueGroupName = queueGroupName;
   
   async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
      // const ticket = await Ticket.findById(data.id);
      // const tickets = await Ticket.find({})
      // console.log(tickets,'tickets que hay en Order DB')
      const { id,version } = data;
      // console.log(id,version,'id y version');
      // const ticket = await Ticket.findByEvent({id:id,version}) ;
      const ticket = await Ticket.findOne({
         _id: data.id,
         // version: data.version - 1,
      }).sort({version:-1});

      // console.log(ticket,'ticket tras findByEvent')
      
      if (!ticket) {
         throw new Error('Ticket not found');
      }
      // el evento me mandará el nuevo price y title
      const { title, price } = data;
      ticket.set({ title, price });
      await ticket.save();
      // console.log(ticket,'ticket tras saving in Order DB')

   
      msg.ack();
   }

}
