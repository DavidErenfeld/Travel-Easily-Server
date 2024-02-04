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
};

const userLogin = {
  email: "test@trip.com",
  password: "12345667867",
};

let accessToken: string;
//Delete DB before test
beforeAll(async () => {
  console.log("jest beforeAll");
  await TripsModel.deleteMany();
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

describe("--Trips Tests--", () => {
  const trip1: ITrips = {
    owner: "David",
    userName: "aa",

    typeTraveler: "type Traveler",
    country: "Country",
    typeTrip: "type Trip",
    numOfDays: 2,
    tripDescription: ["aa", "bb"],
    numOfComments: 0,
    numOfLikes: 0,
  };

  const trip2: ITrips = {
    owner: "moshe",
    userName: "aa",
    typeTraveler: "type Traveler 2",
    country: "Country 2",
    typeTrip: "type Trip 2",
    numOfDays: 1,
    tripDescription: ["tripDescription 2"],
    numOfComments: 0,
    numOfLikes: 0,
  };
  const nonExistingId = new mongoose.Types.ObjectId();
  //FUNCTION  Add a new trip and send to the DB
  const addNewTrip = async (trip: ITrips) => {
    const response = await request(app)
      .post("/trips")
      .set("Authorization", "JWT " + accessToken)
      .send(trip);

    expect(response.statusCode).toEqual(200);
    expect(response.text).toEqual("OK");
  };

  test("1 Test get all trips - empty collection", async () => {
    console.log("Test get all trips -- 0 trips");
    const response = await request(app).get("/trips");
    // console.log(`=================${response}==================`);
    expect(response.statusCode).toEqual(200);
    const data = response.body;
    // console.log(`=================${data}==================`);
    expect(data.length).toEqual(0);
  });

  test("Test 2 add new trip", async () => {
    console.log("Test add new trip");
    await addNewTrip({
      owner: "David",
      userName: "aa",
      typeTraveler: "type Traveler",
      country: "Country",
      typeTrip: "type Trip",
      numOfDays: 2,
      tripDescription: ["aa", "bb"],
      numOfComments: 0,
      numOfLikes: 0,
    });
  });

  test("3 Test get all trips - 1 trip", async () => {
    console.log("Test get all trips -- 1 trip");
    //Test if status cod == 200
    const response = await request(app).get("/trips");

    expect(response.statusCode).toEqual(200);

    //Test if the collection is empty
    const data = response.body;
    expect(data.length).toEqual(1);
    const trip = data[0];
    expect(trip.owner).toBe(user._id);
    expect(trip.userName).toBe(user.userName);
    expect(trip.typeTraveler).toBe(trip1.typeTraveler);
    expect(trip.country).toBe(trip1.country);
    expect(trip.typeTrip).toBe(trip1.typeTrip);
    expect(trip.numOfDays).toBe(trip1.numOfDays);
    expect(trip.tripDescription[0]).toBe(trip1.tripDescription[0]);
    expect(trip.tripDescription[1]).toBe(trip1.tripDescription[1]);
  });

  // test("Test 4 get by owner", async () => {
  //   console.log("Test get all trips -- 1 trip");
  //   //Test if status cod == 200
  //   const response = await request(app)
  //     .get("/trips/owner/user._id")
  //     .set("Authorization", "JWT " + accessToken);
  //   expect(response.statusCode).toEqual(200);
  // });

  // test("Test 4.1 get by owner --file", async () => {
  //   console.log("Test get all trips -- 1 trip");
  //   //Test if status cod == 200
  //   const response = await request(app)
  //     .get("/trips/owner/user._id1w")
  //     .set("Authorization", "JWT " + accessToken);
  //   expect(response.statusCode).toEqual(200);
  // });

  test("Test 5 update trip by id", async () => {
    console.log("update trip by id - Starting test");
    const response = await request(app).get("/trips");
    const data = response.body;
    const updateTrip = data[0];
    const res = await request(app)
      .put(`/trips/${updateTrip._id}`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        _id: updateTrip._id,
        country: "update country",
        numOfDays: 1,
        tripDescription: "update tripDescription",
      });
    expect(res.status).toBe(200);
  });

  test("Test 5.1 update trip by id-- fail", async () => {
    console.log("update user by id-- fail");
    const response = await request(app).get("/trips");
    const data = response.body;
    const updateTrip = data[0];
    const res = await request(app)
      .put(`/trips/${updateTrip._id}2`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        owner: "Davhntbgrvid",
        country: "Countnhtbgrvry",
        numOfDays: 1,
        tripDescription: ",oimunytbr",
      });

    expect(res.statusCode).toBe(500);
  });

  test("Test 5.2 update trip by id-- fail--id is not found", async () => {
    console.log("update user by id-- fail--id is not found");

    const res = await request(app)
      .put(`/trips/${nonExistingId}`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        owner: "Davhntbgrvid",
        country: "Countnhtbgrvry",
        numOfDays: 1,
        tripDescription: ",oimunytbr",
      });

    expect(res.statusCode).toBe(404);
  });

  test("Test 6 add new trip and get all trips - 2 trips", async () => {
    console.log("Test add new trip");
    await addNewTrip(trip2);
    const response = await request(app).get("/trips");
    expect(response.statusCode).toEqual(200);

    //Test if the collection is empty
    const data = response.body;
    expect(data.length).toEqual(2);
  });

  test("Test 7 delete trip by id", async () => {
    console.log("delete trip by id");
    const response = await request(app).get("/trips");
    const data = response.body;
    const trip = data[1];
    // console.log(`=============${user._id}===============`);
    const res = await request(app)
      .delete(`/trips/${trip._id}`)
      .set("Authorization", "JWT " + accessToken)
      .send();

    expect(res.statusCode).toBe(200);
  });

  test("Test 7.1 delete trip by id -- file--id not found", async () => {
    console.log("delete trip by id -- -- file--id not found");

    const res = await request(app)
      .delete(`/trips/${nonExistingId}`)
      .set("Authorization", "JWT " + accessToken)
      .send();

    expect(res.statusCode).toBe(404);
  });

  test("Test 7.2 delete trip by id -- file-- server err", async () => {
    console.log("delete trip by id -- -- file-- server err");

    const res = await request(app)
      .delete(`/trips/${nonExistingId}2`)
      .set("Authorization", "JWT " + accessToken)
      .send();

    expect(res.statusCode).toBe(500);
  });

  test("Test 8 get all trips - 1 trip", async () => {
    console.log("Test get all trips -- 1 trip");
    //Test if status cod == 200
    const response = await request(app).get("/trips");
    expect(response.statusCode).toEqual(200);

    //Test if the collection is empty
    const data = response.body;
    expect(data.length).toEqual(1);
  });

  test("Test 9 Add comment to a trip", async () => {
    console.log("Add comment to a trip");
    const response = await request(app).get("/trips");
    const data = response.body;
    const trip = data[0];
    const res = await request(app)
      .post(`/trips/comments/${trip._id}`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        owner: "David",
        comment: "This is a test comment",
        date: new Date(),
      });

    expect(res.statusCode).toBe(200);
  });

  test("Test 9.1 Add comment to a trip --file User not authenticated", async () => {
    console.log("Add comment to a trip --file User not authenticated");
    const response = await request(app).get("/trips");
    const data = response.body;
    const trip = data[0];
    const res = await request(app)
      .post(`/trips/comments/${trip._id}`)
      .set("Authorization", "JWT " + accessToken + "w")
      .send({
        owner: "David",
        comment: "This is a test comment",
        date: new Date(),
      });

    expect(res.statusCode).toBe(401);
  });

  test("Test 9.1 Add comment to a trip --file Trip not found", async () => {
    console.log("Add comment to a trip --file Trip not found");

    const res = await request(app)
      .post(`/trips/comments/${nonExistingId}`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        owner: "David",
        comment: "This is a test comment",
        date: new Date(),
      });

    expect(res.statusCode).toBe(404);
  });

  test("Test 9.1 Add comment to a trip --file Server err", async () => {
    console.log("Add comment to a trip --file Server err");

    const res = await request(app)
      .post(`/trips/comments/${nonExistingId}12`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        owner: "David",
        comment: "This is a test comment",
        date: new Date(),
      });

    expect(res.statusCode).toBe(500);
  });

  test("Test 10 Add like to a trip", async () => {
    console.log("Add like to a trip");
    const response = await request(app).get("/trips");
    const data = response.body;
    const trip = data[0];
    const res = await request(app)
      .post(`/trips/likes/${trip._id}`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        owner: "David",
      });

    expect(res.statusCode).toBe(200);
  });

  test("Test 10.1 Add 2 likes to a trip", async () => {
    console.log("Add 2 likes to a trip");
    const response = await request(app).get("/trips");
    const data = response.body;
    const trip = data[0];
    const res = await request(app)
      .post(`/trips/likes/${trip._id}`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        owner: "David",
      });

    expect(res.statusCode).toBe(201);
  });

  test("Test 10.2 Add like to a tripn --file Trip not found", async () => {
    console.log("Add like to a trip --file Trip not found");

    const res = await request(app)
      .post(`/trips/likes/${nonExistingId}`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        owner: "David",
      });

    expect(res.statusCode).toBe(404);
  });

  test("Test 10.3 Add like to a tripn --Server err", async () => {
    console.log("Add like to a trip --Server err");

    const res = await request(app)
      .post(`/trips/likes/${nonExistingId}12`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        owner: "David",
      });

    expect(res.statusCode).toBe(500);
  });

  test("Test 11 Remove like from a trip", async () => {
    console.log("Remove like from a trip");
    const response = await request(app).get("/trips");
    const data = response.body;
    const trip = data[0];
    const res = await request(app)
      .delete(`/trips/likes/${trip._id}`)
      .set("Authorization", "JWT " + accessToken);

    expect(res.statusCode).toBe(200);
  });

  test("Test 11.1 Remove like from a trip --file Trip not found", async () => {
    console.log("Remove like from a trip --file Trip not found");

    const res = await request(app)
      .delete(`/trips/likes/${nonExistingId}`)
      .set("Authorization", "JWT " + accessToken);

    expect(res.statusCode).toBe(404);
  });

  test("Test 11.2 Remove like from a trip --file Trip not found", async () => {
    console.log("Remove like from a trip --file Trip not found");

    const res = await request(app)
      .delete(`/trips/likes/${nonExistingId}12`)
      .set("Authorization", "JWT " + accessToken);

    expect(res.statusCode).toBe(500);
  });
});
