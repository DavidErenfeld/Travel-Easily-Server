import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import UserModel, { IUsers } from "../models/users_model";

const user = {
  email: "test@auth.com",
  password: "1238765423",
  userName: "yechiel",
};

const user1 = {
  email: "test1@auth.com",
  password: "1238765423",
  userName: "David",
};

const user2 = {
  password: "1238765423",
  userName: "David",
};

const user3 = {
  email: "test1@auth.com1111",
  password: "1238765423",
  userName: "David",
};

const user4 = {
  email: "test@auth.com",
  password: "12387654231111",
  userName: "yechiel",
};

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string;

let accessToken1: string;
let refreshToken1: string;
//Delete DB before test
beforeAll(async () => {
  console.log("jest beforeAll");
  await UserModel.deleteMany();
});

//Close DB after test
afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("--Auth Tests--", () => {
  test("Test Register", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(200);
  });

  test("Test Register exist email", async () => {
    const response = await request(app).post("/auth/register").send(user);
    expect(response.statusCode).toBe(400);
  });

  test("Test Register missing password", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "test@test.com",
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test Login", async () => {
    const response = await request(app).post("/auth/login").send(user);
    expect(response.statusCode).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
  });

  test("Test Login --file email or password is null", async () => {
    const response = await request(app).post("/auth/login").send(user2);
    expect(response.statusCode).toBe(400);
  });

  test("Test Login --file bad email or password", async () => {
    const response = await request(app).post("/auth/login").send(user3);
    expect(response.statusCode).toBe(400);
  });

  test("Test Login --file password is not match", async () => {
    const response = await request(app).post("/auth/login").send(user4);
    expect(response.statusCode).toBe(400);
  });

  test("Test forbidden access without token", async () => {
    const response = await request(app).post("/trips");
    expect(response.statusCode).toBe(401);
  });

  test("Test access with valid token", async () => {
    const response = await request(app)
      .get("/trips")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });

  test("Test access with invalid token", async () => {
    const response = await request(app)
      .post("/trips")
      .set("Authorization", "JWT 1" + accessToken);
    expect(response.statusCode).toBe(401);
  });

  test("Test refresh token", async () => {
    const response = await request(app)
      .post("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    const newAccessToken = response.body.accessToken;
    newRefreshToken = response.body.refreshToken;

    const response2 = await request(app)
      .post("/trips")
      .set("Authorization", "JWT " + newAccessToken);
    expect(response2.statusCode).toBe(200);
  });

  test("Test refresh token --file", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT ")
      .send();
    expect(response.statusCode).toBe(401);
  });

  test("logeout test", async () => {
    const response1 = await request(app)
      .post("/auth/logout")
      .set("Authorization", "JWT " + refreshToken)
      .send();

    expect(response1.status).toEqual(200);

    const response2 = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response2.status).toEqual(401);
  });

  test("logeout test", async () => {
    const response1 = await request(app)
      .post("/auth/logout")
      .set("Authorization", "JWT " + refreshToken)
      .send();

    expect(response1.status).toEqual(401);
  });

  test("logeout test --file token is null", async () => {
    const response1 = await request(app)
      .post("/auth/logout")
      .set("Authorization", "JWT ")
      .send();

    expect(response1.status).toEqual(401);
  });

  test("Test Register 2", async () => {
    const response = await request(app).post("/auth/register").send(user1);
    expect(response.statusCode).toBe(200);
  });

  test("Test Login", async () => {
    const response = await request(app).post("/auth/login").send(user1);
    expect(response.statusCode).toBe(200);
    accessToken1 = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken1).toBeDefined();
  });

  test("Test access after timeout of token", async () => {
    jest.setTimeout(10000);
    await new Promise((resolve) => setTimeout(() => resolve("done"), 4000));

    const response = await request(app)
      .post("/trips")
      .set("Authorization", "JWT " + accessToken1);
    expect(response.statusCode).not.toBe(200);
  });

  test("Test double use of refresh token", async () => {
    const response = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response.statusCode).toEqual(200);

    //verify that the new token is not valid as well
    const response1 = await request(app)
      .get("/auth/refresh")
      .set("Authorization", "JWT " + refreshToken)
      .send();
    expect(response1.statusCode).not.toEqual(200);
  });
});
