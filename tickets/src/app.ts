import express from "express";
import { createTicketRouter } from "./routes/new";

import "express-async-errors";
import { NotFoundError, errorHandler } from "@elearntickets/common";
import cookieSession from "cookie-session";
import { showTicketsRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        secure: true,
        httpOnly: true
    })
);

app.use(createTicketRouter);
app.use(showTicketsRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async () => {
    throw new NotFoundError();
});
app.use("*", errorHandler);

export { app };
