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

const createTickets = async () => {
    await request(app).post("/api/tickets").set("Cookie", signin()).send({
        title: "test",
        price: 20
    });

    await request(app).post("/api/tickets").set("Cookie", signin()).send({
        title: "test",
        price: 20
    });

    await request(app).post("/api/tickets").set("Cookie", signin()).send({
        title: "test",
        price: 20
    });
};

it("should return list of tickets", async () => {
    await createTickets();
    const response = await request(app).get("/api/tickets").send().expect(200);
    expect(response.body.length).toEqual(3);
});
