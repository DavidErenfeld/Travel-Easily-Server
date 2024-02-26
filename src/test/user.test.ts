import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import UsersModel, { IUsers } from "../models/users_model";

const user: IUsers = {
  email: "test@trip.com",
  password: "12345667867",
  userName: "yechiel",
  imgUrl: "test/test",
  authType: "application",
};

const userLogin = {
  email: "test@trip.com",
  password: "12345667867",
};

let accessToken: string;

beforeAll(async () => {
  await UsersModel.deleteMany();
  const responseRegister = await request(app).post("/auth/register").send(user);
  user._id = responseRegister.body._id;
  const responseLogin = await request(app).post("/auth/login").send(user);
  accessToken = responseLogin.body.accessToken;
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("--User Tests--", () => {
  const nonExistingId = new mongoose.Types.ObjectId();

  test("Test 1 update user by id", async () => {
    const res = await request(app)
      .put(`/users/${user._id}`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        userName: "David",
        imgUrl: "aaa/aaaaa",
      });

    expect(res.status).toBe(200);
    expect(res.body.userName).toBe("David");
    expect(res.body.imgUrl).toBe("aaa/aaaaa");
  });

  test("Test 2 update user by id -- fail", async () => {
    const res = await request(app)
      .put(`/users/${nonExistingId}`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        userName: "David",
        imgUrl: "aaa/aaaaa",
      });

    expect(res.status).toBe(404);
  });

  test("Test 3 update user by id -- fail", async () => {
    const res = await request(app)
      .put(`/users/${nonExistingId}6`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        userName: "David",
        imgUrl: "aaa/aaaaa",
      });

    expect(res.status).toBe(500);
  });
});
