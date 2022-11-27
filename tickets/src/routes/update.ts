import { currentUser, NotFoundError, requireAuth, UnauthorizedError, validateRequest } from "@elearntickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/tickets-model";

const router = express.Router();

router.put(
    "/api/tickets/:id",
    currentUser,
    requireAuth,
    [
        body("title").notEmpty().withMessage("Title is a required field"),
        body("price").isFloat({ gt: 0 }).withMessage("Price should be greater than 0")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const { price, title } = req.body;
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.userId !== req.currentUser!.id) {
            throw new UnauthorizedError();
        }

        ticket.price = price;
        ticket.title = title;
        await ticket.save();

        res.send(ticket);
    }
);

export { router as updateTicketRouter };
