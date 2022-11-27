import request from "supertest";
import { app } from "../../app";
import jsonwebtoken from "jsonwebtoken";
import { Ticket } from "../../models/tickets-model";

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

it("has a route handler listening to /api/tickets for post request", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app).post("/api/tickets").set("Cookie", signin()).send({});
    expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title: "",
            price: 10
        })
        .expect(400);
    await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            price: 10
        })
        .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title: "Test",
            price: -10
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title: "Test"
        })
        .expect(400);
});

it("creates a new ticket with valid input", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const response = await request(app).post("/api/tickets").set("Cookie", signin()).send({
        title: "First Ticket",
        price: 20
    });
    expect(response.status).toEqual(201);
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual("20");
    expect(tickets[0].title).toEqual("First Ticket");
});

