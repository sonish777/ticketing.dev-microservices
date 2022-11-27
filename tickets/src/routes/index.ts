import express from "express";
import { Ticket } from "../models/tickets-model";

const router = express.Router();

router.get("/api/tickets", async (req, res) => {
    const tickets = await Ticket.find({});
    return res.status(200).send(tickets);
});

export { router as indexTicketRouter };
