import { OrderCancelledEvent, OrderStatus } from "@oscargmk8s/common"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from 'mongoose';
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/Order";

jest.mock('../../../nats-wrapper')

const setup = async () => {
   const listener = new OrderCancelledListener(natsWrapper.client);

   const order = Order.build({
      id: mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      price: 10,
      userId: 'asdf',
      version: 0
   })
   
   await order.save();
   
   const data: OrderCancelledEvent['data'] = {
      id: order.id,
      version: 1, //debe de ser una más que la version actual
      ticket: {
         id: mongoose.Types.ObjectId().toHexString()
      }
   }

   // @ts-ignore
   const msg: Message = {
      ack: jest.fn()
   }

   return { listener, data, msg, order };

}

it('updates the status of the order', async () => {
   const { listener, data, order, msg } = await setup();

   await listener.onMessage(data, msg);
   // busco la order por el id
   const updatedOrder = await Order.findById(order.id);
   // y compruebo su estatus,debe estar cancelada
   expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('acks the message', async () => {
   const { listener, data, msg } = await setup();

   await listener.onMessage(data, msg);

   expect(msg.ack).toHaveBeenCalled();
})