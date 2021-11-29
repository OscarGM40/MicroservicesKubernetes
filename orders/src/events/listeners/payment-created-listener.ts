
import { Subjects, Listener, PaymentCreatedEvent, OrderStatus } from '@oscargmk8s/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'],
    msg: Message) {
      // recuerda que el payment:created me trae un orderId
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();
    // aqui deberia publicar que se ha actualizado una orden,pero como la ponemos en completed realmente no hacen falta mas pasos,pero,ojo, si harian falta si no fuera el último paso

    msg.ack();
  }
}