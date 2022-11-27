import { NotFoundError } from "@elearntickets/common";
import { Request, Response, Router } from "express";
import { Ticket } from "../models/tickets-model";

const router = Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        throw new NotFoundError();
    }
    return res.status(200).send(ticket);
});

export { router as showTicketsRouter };
