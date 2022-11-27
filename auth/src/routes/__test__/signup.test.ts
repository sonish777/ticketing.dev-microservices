import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@email.com",
            password: "test1234"
        })
        .expect(201);
});
