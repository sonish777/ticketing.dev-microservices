import express from "express";
import cors from "cors";

import "express-async-errors";
import { NotFoundError, errorHandler } from "@elearntickets/common";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(cors());
app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== "test"
    })
);

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all("*", async () => {
    throw new NotFoundError();
});
app.use("*", errorHandler);

export { app };
