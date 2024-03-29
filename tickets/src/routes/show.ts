import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@k8stickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) throw new NotFoundError('ticket not found!');

  res.send(ticket);
});

export { router as showTicketRouter };
