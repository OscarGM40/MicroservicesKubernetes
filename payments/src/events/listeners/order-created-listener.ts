
import { Listener, OrderCreatedEvent, Subjects } from '@oscargmk8s/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
   // creamos el Order
   const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
   });
   // guardamos el Order
   await order.save();

   // aseguramos que el evento se recibió y procesó correctamente
   msg.ack();

  }
}