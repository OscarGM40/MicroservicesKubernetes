
import { Listener, OrderStatus, ExpirationCompleteEvent, Subjects } from '@oscargmk8s/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/Order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
   readonly subject = Subjects.ExpirationComplete;
   queueGroupName = queueGroupName;
   
   async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
      const order = await Order.findById(data.orderId).populate('ticket');
      // console.log(order,'order');
   
      if (!order) {
         throw new Error('Order not found');
      }
   
      if (order.status === OrderStatus.Complete) {
         return msg.ack();
      }
   
      order.set({
         status: OrderStatus.Cancelled,
      });

      await order.save();

      await new OrderCancelledPublisher(this.client).publish({
         id: order.id,
         version: order.version,
         ticket: {
            id: order.ticket.id,
         },
      });
   
      msg.ack();
   }
   }