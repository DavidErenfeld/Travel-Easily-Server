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
  authType: "application",
};

// const userLogin = {
//   email: "test@trip.com",
//   password: "12345667867",
// };

let accessToken: string;
let userId: string;
let userName: string;
//Delete DB before test
beforeAll(async () => {
  console.log("jest beforeAll");
  await TripsModel.deleteMany();
  await UsersModel.deleteMany();
  const responseRegister = await request(app).post("/auth/register").send(user);
  userId = responseRegister.body._id; // שמירת ה-_id של המשתמש לשימוש בבדיקות
  userName = responseRegister.body.userName; // שמירת ה-_id של המשתמש לשימוש בבדיקות
  const responseLogin = await request(app).post("/auth/login").send(user);
  accessToken = responseLogin.body.accessToken;
});
//Close DB after test
afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("--Trips Tests--", () => {
  const trip1: ITrips = {
    userName: "aa",
    // owner: "David",
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
    // userName: "aa",
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
    console.log(`----------------------${response}`);

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
    const response = await addNewTrip(trip1);
  });

  test("3 Test get all trips - 1 trip", async () => {
    console.log("Test get all trips -- 1 trip");
    const response = await request(app).get("/trips");
    expect(response.statusCode).toEqual(200);
    const data = response.body;
    expect(data.length).toEqual(1);
  });

  test("Test 4 get by owner", async () => {
    console.log("Test get by owner");
    //Test if status cod == 200
    const response = await request(app)
      .get(`/trips/${userId}`)
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toEqual(200);
  });

  test("Test 4.1 get by owner --file", async () => {
    console.log("Test get by owner --file");
    //Test if status cod == 200
    const response = await request(app)
      .get(`/trips/${nonExistingId}`)
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toEqual(201);
  });

  test("Test 4.3 get by tripId ", async () => {
    console.log("Test get by tripId");
    const response1 = await request(app).get("/trips");
    const data = response1.body;
    const trip = data[0];

    const response2 = await request(app)
      .get(`/trips/trip/${trip._id}`)
      .set("Authorization", "JWT " + accessToken);
    expect(response2.statusCode).toEqual(200);
  });

  test("Test 4.4 get by tripId --null", async () => {
    console.log("Test get by tripId --null");
    const response1 = await request(app).get("/trips");
    const data = response1.body;
    const trip = data[0];

    const response2 = await request(app)
      .get(`/trips/trip/${trip._id}dd`)
      .set("Authorization", "JWT " + accessToken);
    expect(response2.statusCode).toEqual(500);
  });

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

  test("Test delete comment ", async () => {
    console.log("Test delete comment");
    const response = await request(app).get("/trips");
    const data = response.body;
    const trip = data[0];
    const res = await request(app)
      .delete(`/trips/comments/${trip._id}/${trip.comments._id})}`)
      .set("Authorization", "JWT " + accessToken);

    expect(res.statusCode).toBe(200);
  });

  test("Test delete comment -- fail ", async () => {
    console.log("Test delete comment -- fail");
    const response = await request(app).get("/trips");
    const data = response.body;
    const trip = data[0];
    const res = await request(app)
      .delete(`/trips/comments/${(trip._id, trip.comments._id)})}`)
      .set("Authorization", "JWT " + accessToken);

    expect(res.statusCode).toBe(404);
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

    expect(res.statusCode).toBe(200);
  });

  test("Test 10.2 Add like to a tripn --file Trip not found", async () => {
    console.log("Add like to a trip --file Trip not found");

    const res = await request(app)
      .post(`/trips/likes/${trip2._id}`)
      .set("Authorization", "JWT " + accessToken)
      .send({
        owner: "David",
      });

    expect(res.statusCode).toBe(500);
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
});
