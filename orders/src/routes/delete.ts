import express, { Request, Response } from "express";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@oscargmk8s/common";
import { Order, OrderStatus } from "../models/Order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
   const orderId = req.params.orderId;

   const order = await Order.findById(orderId).populate('ticket');

   if (!order) { throw new NotFoundError() }
   
   if(order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
   }
   order.status = OrderStatus.Cancelled;
   await order.save();

   // publishing an event saying this order has been cancelled
   new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
         id: order.ticket.id
      }
   });
   // send back a response to the front
   res.status(204).send(order);
})

export { router as deleteOrderRouter };