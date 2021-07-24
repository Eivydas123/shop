import request from "supertest";
import app from "../app";
// import { createNodeRedisClient } from "handy-redis";

// beforeAll(() => {
//   const client = createNodeRedisClient({});
//   client.nodeRedis.on("ready", () => console.log("connected to redis"));
//   client.nodeRedis.on("error", (err: Error) => console.log(err));
//   client.nodeRedis.on("SIGINT", () => client.quit());
// });

describe("test the user", () => {
  test("It should fail with status 422", async () => {
    const res = await request(app).get(
      "http://localhost:3000/api/v1/roledsdsd"
    );
    console.log(res);
    expect(res.statusCode).toBe(404);
  });
});
