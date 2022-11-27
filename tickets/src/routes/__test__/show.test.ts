import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";
import jsonwebtoken from "jsonwebtoken";

const signin = () => {
    const payload = {
        id: 123,
        email: "test@email.com"
    };
    const token = jsonwebtoken.sign(payload, process.env.JWT_KEY!);
    const json = {
        jwt: token
    };
    const session = JSON.stringify(json);
    const encodedSession = Buffer.from(session).toString("base64");

    return [`express:sess=${encodedSession}`];
};

it("returns a 404 if the ticket with given id is not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the ticket with given id if found", async () => {
    const response = await request(app).post("/api/tickets").set("Cookie", signin()).send({ title: "Test", price: 100 }).expect(201);

    const ticket = await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);
    expect(ticket.body.title).toEqual("Test");
    expect(ticket.body.price).toEqual("100");
});
