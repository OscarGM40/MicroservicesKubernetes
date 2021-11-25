






import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from '@oscargmk8s/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/Order';


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
   readonly subject = Subjects.OrderCancelled;
   queueGroupName = queueGroupName;

   async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
      // realmente no haria falta la version,porque no va a haber problemas de concurrencia
      const order = await Order.findOne({
         _id: data.id,
         version: data.version - 1
      });

      if (!order) {
         throw new Error('Order not found');
      }

      order.set({ status: OrderStatus.Cancelled });
      await order.save();

      msg.ack();
   }
}
