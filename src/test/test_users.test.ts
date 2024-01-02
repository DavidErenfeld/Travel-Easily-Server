import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import UsersModel from "../models/users_model";

interface IUsers {
  email: string;
  password: string;
}
//Delete DB before test
beforeAll(async () => {
  console.log("jest beforeAll");
  await UsersModel.deleteMany();
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

describe("--Auth Tests--", () => {
  const user1 = {
    email: "1020dud@gmail.com",
    password: "123456543",
  };

  const user2 = {
    email: "1020dud@gmail.com",
    password: "1234561324",
  };

  const user3 = {
    email: "John@gmail.com",
    password: "123456",
  };

  const user4 = {
    email: "Doe@gmail.com",
    password: "123456",
  };

  //FUNCTION  Add a new student and send to the DB
  const addNewUser = async (user: IUsers) => {
    const response = await request(app).post("/").send(user);

    expect(response.statusCode).toEqual(200);
    expect(response.text).toEqual("OK");
  };

  test("1 Test get all users - empty collection", async () => {
    console.log("Test get all users -- 0 users");
    //Test if status cod == 200
    const response = await request(app).get("/");
    expect(response.statusCode).toEqual(200);

    //Test if the collection is empty
    const data = response.body;
    expect(data.length).toEqual(0);
  });

  test("Test 2 add new user", async () => {
    console.log("Test add new user");
    await addNewUser(user1);
  });

  test("3 Test get all users - 1 user", async () => {
    console.log("Test get all users -- 1 user");
    //Test if status cod == 200
    const response = await request(app).get("/");
    expect(response.statusCode).toEqual(200);

    //Test if the collection is empty
    const data = response.body;
    expect(data.length).toEqual(1);
    const user = data[0];
    console.log(user.email);
    console.log(user.password);
    expect(user.email).toBe(user1.email);
    expect(user.password).toBe(user1.password);
  });

  test("Test 4 update user by id", async () => {
    console.log("update user by id");
    const response = await request(app).get("/");
    const data = response.body;
    const user = data[0];
    // console.log(`=============${user._id}===============`);
    const res = await request(app).put(`/${user._id}`).send({
      _id: user._id,
      email: "www@gmail.com",
      password: "123123123",
    });

    expect(res.statusCode).toBe(200);
  });

  test("Test 5 update user by id-- fail", async () => {
    console.log("update user by id-- fail");
    const response = await request(app).get("/");
    const data = response.body;
    const user = data[0];
    // console.log(`=============${user._id}===============`);
    const res = await request(app).put(`/${user._id}2`).send({
      _id: user._id,
      email: "www@gmail.com",
      password: "123123123",
    });

    expect(res.statusCode).toBe(500);
  });

  test("Test 6 delete user by id", async () => {
    console.log("delete user by id");
    const response = await request(app).get("/");
    const data = response.body;
    const user = data[0];
    // console.log(`=============${user._id}===============`);
    const res = await request(app).delete(`/${user._id}`).send();

    expect(res.statusCode).toBe(200);
  });

  test("Test 7 get all users - empty collection", async () => {
    console.log("Test get all users == 0");
    //Test if status cod == 200
    const response = await request(app).get("/");
    expect(response.statusCode).toEqual(200);

    //Test if the collection is empty
    const data = response.body;
    expect(data.length).toEqual(0);
  });
});
