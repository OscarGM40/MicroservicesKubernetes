
import express, { Request, Response } from "express";
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@oscargmk8s/common";
import { body } from 'express-validator';
import mongoose from "mongoose";
import { Ticket } from '../models/Ticket';
import { Order } from "../models/Order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";


const router = express.Router();

// const EXPIRATION_WINDOW_SECONDS = 15 * 60;
const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post('/api/orders', requireAuth, [
   body('ticketId')
      .not()
      .isEmpty()
      .withMessage('Ticket id is required')
      .isMongoId()
      .withMessage('TicketId must be a valid MongoObjectId')
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be a valid MongoId'),
],
   validateRequest,
   async (req: Request, res: Response) => {
      const { ticketId } = req.body;
      // find the ticket the user is trying to order in the DB
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) { throw new NotFoundError() }

      // make sure the ticket is not already reserved(fijate que esto es algo muy normal en la realidad,de echo es un asunto muy importante,muchos usuarios querrán en muy poco  tiempo reservar el ticket)
      const isReserved = await ticket.isReserved();
      if (isReserved) {
         throw new BadRequestError('Ticket is already reserved');
      }
      // calculate an expiration date for the order(+15m)
      const expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);


      // build the order and save it to DB
      const order = Order.build({
         userId: req.currentUser!.id,
         status: OrderStatus.Created,
         expiresAt: expiration,
         ticket
      });
      await order.save();
      // tell to the rest of the app that an order was created(publish an event)
      new OrderCreatedPublisher(natsWrapper.client).publish({
         id: order.id,
         version: order.version, 
         status: order.status,
         userId: order.userId,
         expiresAt: order.expiresAt.toISOString(),
         ticket: {
            id: ticket.id,
            price: ticket.price  
         }
      });

      // send back the response
      res.status(201).send(order);
   });

export { router as newOrderRouter };