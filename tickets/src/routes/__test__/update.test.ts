import mongoose, { mongo } from "mongoose";
import request from "supertest";
import jsonwebtoken from "jsonwebtoken";

import { app } from "../../app";

const signin = () => {
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
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

it("should return a status of 404 if the ticket was not found", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", signin())
        .send({
            title: "test",
            price: 20
        })
        .expect(404);
});

it("should return a status of 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "test",
            price: 20
        })
        .expect(401);
});

it("should return a status of 401 if the user is does not own the ticket", async () => {
    const response = await request(app).post("/api/tickets").set("Cookie", signin()).send({
        title: "Test test",
        price: 20
    });
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", signin())
        .send({
            title: "New title",
            price: 200
        })
        .expect(401);
});

it("should return a status of 400 if the user provides an invalid title or price", async () => {
    const response = await request(app).post("/api/tickets").set("Cookie", signin()).send({
        title: "Test test",
        price: 20
    });
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", signin())
        .send({
            title: "",
            price: 200
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", signin())
        .send({
            title: "New title"
        })
        .expect(400);
});

it("should update the ticket data if the user provides a valid data", async () => {
    const cookie = signin();
    const response = await request(app).post(`/api/tickets`).set("Cookie", cookie).send({
        title: "test",
        price: 200
    });
    const newPayload = {
        title: "New Title",
        price: 9999
    };
    const updatedTicket = await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            ...newPayload
        })
        .expect(200);

    expect(updatedTicket.body.title).toEqual(newPayload.title);
    expect(updatedTicket.body.price.toString()).toEqual(newPayload.price.toString());
});
