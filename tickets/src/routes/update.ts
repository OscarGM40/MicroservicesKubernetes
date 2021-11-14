/*  */import express,{ Request, Response } from 'express';
const mongoose = require('mongoose');
//  model
import { Ticket } from '../models/Ticket';
//  errors validation
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError
} from '@oscargmk8s/common';
// import events
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// @route PUT api/tickets
// @desc Update a ticket
// @access Private
router.put('/api/tickets/:id', requireAuth,[
   body('title').not().isEmpty().withMessage('title is required'),
   body('price').isFloat({gt:0}).withMessage('price must be greater than 0'),
],validateRequest, async (req: Request, res: Response) => {
   
   const ticket = await Ticket.findById(req.params.id);
   if(!ticket) {
      throw new NotFoundError();
   }

   if(ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
   }

   ticket.set({...req.body })

   await ticket.save();
   
   // y porque no hace asincrono este??
   new TicketUpdatedPublisher(natsWrapper.client)
   .publish({
      id: ticket.id,
      title:ticket.title,
      price:ticket.price,
      userId:ticket.userId,
      version:ticket.version,
   })

   res.send(ticket)
   
})


export { router as updateTicketRouter };