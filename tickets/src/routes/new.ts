import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import { body } from 'express-validator';
import { DatabaseConnectionError, requireAuth, validateRequest } from '@oscargmk8s/common';
import { Ticket } from "../models/Ticket";
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

// @route POST api/tickets
// @desc Create a ticket
// @access Private
// @param req
// @param res  <- en realidad no los lleva asi  n
router.post('/api/tickets', requireAuth,
   [
      // un not().isEmpty() va a probar que venga y que no este vacio(las dos opciones)
      body('title').not().isEmpty().withMessage('Title is required'),
      body('price').not().isEmpty().withMessage('Price is required'),
      body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
   ], validateRequest, async (req: Request, res: Response) => {
      const { title, price } = req.body;

      const ticket = Ticket.build({
         title,
         price,
         userId: req.currentUser!.id
      })

      // handle transaction lo mejor es una transaccion willy
      const SESSION = await mongoose.startSession();
      try {
         SESSION.startTransaction();
         await ticket.save();
         // recuerda que con mongoose puedo usar pre y post save hooks, Stephen recomienda encarecidamente publicar lo último,que será lo que arroje la DB,por los hooks de mongoose.
         await new TicketCreatedPublisher(natsWrapper.client)
            .publish({
               id: ticket.id,
               title: ticket.title,
               price: ticket.price,
               userId: ticket.userId,
            });
         await SESSION.commitTransaction();
         res.status(201).send(ticket);
      } catch (error) {
         await SESSION.abortTransaction();
         throw new DatabaseConnectionError();
      } finally {
         SESSION.endSession();
      }
   })

export { router as createTicketRouter };