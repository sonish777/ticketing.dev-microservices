import { currentUser, requireAuth, validateRequest } from "@elearntickets/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/tickets-model";

const router = express.Router();

router.post(
    "/api/tickets",
    currentUser,
    requireAuth,
    [body("title").notEmpty().withMessage("Title is required"), body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;
        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id
        });
        await ticket.save();
        res.status(201).send(ticket);
    }
);

export { router as createTicketRouter };
