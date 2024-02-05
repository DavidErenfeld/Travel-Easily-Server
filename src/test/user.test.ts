import request from "supertest";
import app from "../app";
import mongoose, { now } from "mongoose";
import TripsModel, { ITrips } from "../models/trips_model";
import UsersModel, { IUsers } from "../models/users_model";
import { AuthRequest } from "../controllers/trips_controller";

const user: IUsers = {
  email: "test@trip.com",
  password: "12345667867",
  userName: "yechiel",
  imgUrl: "test/test",
};

const userLogin = {
  email: "test@trip.com",
  password: "12345667867",
};

let accessToken: string;
//Delete DB before test
beforeAll(async () => {
  console.log("jest beforeAll");
  // await TripsModel.deleteMany();
  await UsersModel.deleteMany();
  const responseRegister = await request(app).post("/auth/register").send(user);
  user._id = responseRegister.body._id;
  await request(app).post("/auth/register").send(user);
  const responseLogin = await request(app).post("/auth/login").send(user);
  accessToken = responseLogin.body.accessToken;
});

//Close DB after test
afterAll((done) => {
  mongoose.connection.close();
  done();
});

// const stopConnection = function (String) {
//   jest.spyOn(Student, String).mockImplementation(() => {
//     throw new Error("Connection error");
//   });
// };

describe("--User Tests--", () => {
  const nonExistingId = new mongoose.Types.ObjectId();

  test("Test 1 update user by id", async () => {
    console.log("update user by id - Starting test");
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
    console.log("update user by id - Starting test");
    const res = await request(app)
      .put(`/users/${nonExistingId}`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        userName: "David",
        imgUrl: "aaa/aaaaa",
      });
    console.log(res.body);
    expect(res.status).toBe(404);
  });

  test("Test 3 update user by id -- fail", async () => {
    console.log("update user by id - Starting test");
    const res = await request(app)
      .put(`/users/${nonExistingId}6`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        userName: "David",
        imgUrl: "aaa/aaaaa",
      });
    console.log(res.body);
    expect(res.status).toBe(500);
  });

  // test("Test 5.2 update trip by id-- fail--id is not found", async () => {
  //   console.log("update user by id-- fail--id is not found");

  //   const res = await request(app)
  //     .put(`/users/${}`)
  //     .set("Authorization", "JWT " + accessToken)
  //     .send({
  //       owner: "Davhntbgrvid",
  //       country: "Countnhtbgrvry",
  //       numOfDays: 1,
  //       tripDescription: ",oimunytbr",
  //     });

  //   expect(res.statusCode).toBe(404);
  // });
});
