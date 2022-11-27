import mongoose from "mongoose";

beforeAll(async () => {
    process.env.JWT_KEY = "test_jwt_secret_key";

    await mongoose.connect("mongodb://localhost:27017/tickets-test");
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    // await mongo.stop();
    await mongoose.connection.close();
});

