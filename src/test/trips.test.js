"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const trips_model_1 = __importDefault(require("../models/trips_model"));
const users_model_1 = __importDefault(require("../models/users_model"));
const user = {
    email: "test@trip.com",
    password: "12345667867",
    userName: "yechiel",
    authType: "application",
};
// const userLogin = {
//   email: "test@trip.com",
//   password: "12345667867",
// };
let accessToken;
let userId;
let userName;
//Delete DB before test
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("jest beforeAll");
    yield trips_model_1.default.deleteMany();
    yield users_model_1.default.deleteMany();
    const responseRegister = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(user);
    userId = responseRegister.body._id; // שמירת ה-_id של המשתמש לשימוש בבדיקות
    userName = responseRegister.body.userName; // שמירת ה-_id של המשתמש לשימוש בבדיקות
    const responseLogin = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send(user);
    accessToken = responseLogin.body.accessToken;
}));
//Close DB after test
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
// const stopConnection = function (String) {
//   jest.spyOn(Student, String).mockImplementation(() => {
//     throw new Error("Connection error");
//   });
// };
describe("--Trips Tests--", () => {
    const trip1 = {
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
    const trip2 = {
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
    const nonExistingId = new mongoose_1.default.Types.ObjectId();
    //FUNCTION  Add a new trip and send to the DB
    const addNewTrip = (trip) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/trips")
            .set("Authorization", "JWT " + accessToken)
            .send(trip);
        console.log(`----------------------${response}`);
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual("OK");
    });
    test("1 Test get all trips - empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test get all trips -- 0 trips");
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        // console.log(`=================${response}==================`);
        expect(response.statusCode).toEqual(200);
        const data = response.body;
        // console.log(`=================${data}==================`);
        expect(data.length).toEqual(0);
    }));
    test("Test 2 add new trip", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test add new trip");
        const response = yield addNewTrip(trip1);
    }));
    test("3 Test get all trips - 1 trip", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test get all trips -- 1 trip");
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        expect(response.statusCode).toEqual(200);
        const data = response.body;
        expect(data.length).toEqual(1);
        const trip = data[0];
        expect(trip.owner).toBe(userId); // השוואה נכונה לאחר שינוי
        expect(trip.userName).toBe(userName); // השוואה נכונה לאחר שינוי
        expect(trip.typeTraveler).toBe(trip1.typeTraveler);
        expect(trip.country).toBe(trip1.country);
        expect(trip.typeTrip).toBe(trip1.typeTrip);
        expect(trip.numOfDays).toBe(trip1.numOfDays);
        expect(trip.tripDescription[0]).toBe(trip1.tripDescription[0]);
        expect(trip.tripDescription[1]).toBe(trip1.tripDescription[1]);
    }));
    test("Test 4 get by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test get by owner");
        //Test if status cod == 200
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/trips/${userId}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(200);
    }));
    test("Test 4.1 get by owner --file", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test get by owner --file");
        //Test if status cod == 200
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/trips/${nonExistingId}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toEqual(201);
    }));
    test("Test 4.3 get by tripId ", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test get by tripId");
        const response1 = yield (0, supertest_1.default)(app_1.default).get("/trips");
        const data = response1.body;
        const trip = data[0];
        const response2 = yield (0, supertest_1.default)(app_1.default)
            .get(`/trips/trip/${trip._id}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response2.statusCode).toEqual(200);
    }));
    test("Test 4.4 get by tripId --null", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test get by tripId --null");
        const response1 = yield (0, supertest_1.default)(app_1.default).get("/trips");
        const data = response1.body;
        const trip = data[0];
        const response2 = yield (0, supertest_1.default)(app_1.default)
            .get(`/trips/trip/${trip._id}dd`)
            .set("Authorization", "JWT " + accessToken);
        expect(response2.statusCode).toEqual(500);
    }));
    test("Test 5 update trip by id", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("update trip by id - Starting test");
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        const data = response.body;
        const updateTrip = data[0];
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/trips/${updateTrip._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send({
            _id: updateTrip._id,
            country: "update country",
            numOfDays: 1,
            tripDescription: "update tripDescription",
        });
        expect(res.status).toBe(200);
    }));
    test("Test 5.1 update trip by id-- fail", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("update user by id-- fail");
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        const data = response.body;
        const updateTrip = data[0];
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/trips/${updateTrip._id}2`)
            .set("Authorization", "JWT " + accessToken)
            .send({
            owner: "Davhntbgrvid",
            country: "Countnhtbgrvry",
            numOfDays: 1,
            tripDescription: ",oimunytbr",
        });
        expect(res.statusCode).toBe(500);
    }));
    test("Test 5.2 update trip by id-- fail--id is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("update user by id-- fail--id is not found");
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/trips/${nonExistingId}`)
            .set("Authorization", "JWT " + accessToken)
            .send({
            owner: "Davhntbgrvid",
            country: "Countnhtbgrvry",
            numOfDays: 1,
            tripDescription: ",oimunytbr",
        });
        expect(res.statusCode).toBe(404);
    }));
    test("Test 6 add new trip and get all trips - 2 trips", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test add new trip");
        yield addNewTrip(trip2);
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        expect(response.statusCode).toEqual(200);
        //Test if the collection is empty
        const data = response.body;
        expect(data.length).toEqual(2);
    }));
    test("Test 7 delete trip by id", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("delete trip by id");
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        const data = response.body;
        const trip = data[1];
        // console.log(`=============${user._id}===============`);
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/trips/${trip._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send();
        expect(res.statusCode).toBe(200);
    }));
    test("Test 7.1 delete trip by id -- file--id not found", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("delete trip by id -- -- file--id not found");
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/trips/${nonExistingId}`)
            .set("Authorization", "JWT " + accessToken)
            .send();
        expect(res.statusCode).toBe(404);
    }));
    test("Test 7.2 delete trip by id -- file-- server err", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("delete trip by id -- -- file-- server err");
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/trips/${nonExistingId}2`)
            .set("Authorization", "JWT " + accessToken)
            .send();
        expect(res.statusCode).toBe(500);
    }));
    test("Test 8 get all trips - 1 trip", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test get all trips -- 1 trip");
        //Test if status cod == 200
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        expect(response.statusCode).toEqual(200);
        //Test if the collection is empty
        const data = response.body;
        expect(data.length).toEqual(1);
    }));
    test("Test 9 Add comment to a trip", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Add comment to a trip");
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        const data = response.body;
        const trip = data[0];
        const res = yield (0, supertest_1.default)(app_1.default)
            .post(`/trips/comments/${trip._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send({
            owner: "David",
            comment: "This is a test comment",
            date: new Date(),
        });
        expect(res.statusCode).toBe(200);
    }));
    test("Test 9.1 Add comment to a trip --file User not authenticated", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Add comment to a trip --file User not authenticated");
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        const data = response.body;
        const trip = data[0];
        const res = yield (0, supertest_1.default)(app_1.default)
            .post(`/trips/comments/${trip._id}`)
            .set("Authorization", "JWT " + accessToken + "w")
            .send({
            owner: "David",
            comment: "This is a test comment",
            date: new Date(),
        });
        expect(res.statusCode).toBe(401);
    }));
    test("Test 9.1 Add comment to a trip --file Trip not found", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Add comment to a trip --file Trip not found");
        const res = yield (0, supertest_1.default)(app_1.default)
            .post(`/trips/comments/${nonExistingId}`)
            .set("Authorization", "JWT " + accessToken)
            .send({
            owner: "David",
            comment: "This is a test comment",
            date: new Date(),
        });
        expect(res.statusCode).toBe(404);
    }));
    test("Test 9.1 Add comment to a trip --file Server err", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Add comment to a trip --file Server err");
        const res = yield (0, supertest_1.default)(app_1.default)
            .post(`/trips/comments/${nonExistingId}12`)
            .set("Authorization", "JWT " + accessToken)
            .send({
            owner: "David",
            comment: "This is a test comment",
            date: new Date(),
        });
        expect(res.statusCode).toBe(500);
    }));
    test("Test delete comment ", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test delete comment");
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        const data = response.body;
        const trip = data[0];
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/trips/comments/${trip._id}/${trip.comments._id})}`)
            .set("Authorization", "JWT " + accessToken);
        expect(res.statusCode).toBe(200);
    }));
    test("Test delete comment -- fail ", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test delete comment -- fail");
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        const data = response.body;
        const trip = data[0];
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/trips/comments/${(trip._id, trip.comments._id)})}`)
            .set("Authorization", "JWT " + accessToken);
        expect(res.statusCode).toBe(404);
    }));
    test("Test 10 Add like to a trip", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Add like to a trip");
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        const data = response.body;
        const trip = data[0];
        const res = yield (0, supertest_1.default)(app_1.default)
            .post(`/trips/likes/${trip._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send({
            owner: "David",
        });
        expect(res.statusCode).toBe(200);
    }));
    test("Test 10.1 Add 2 likes to a trip", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Add 2 likes to a trip");
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        const data = response.body;
        const trip = data[0];
        const res = yield (0, supertest_1.default)(app_1.default)
            .post(`/trips/likes/${trip._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send({
            owner: "David",
        });
        expect(res.statusCode).toBe(200);
    }));
    test("Test 10.2 Add like to a tripn --file Trip not found", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Add like to a trip --file Trip not found");
        const res = yield (0, supertest_1.default)(app_1.default)
            .post(`/trips/likes/${trip2._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send({
            owner: "David",
        });
        expect(res.statusCode).toBe(500);
    }));
    test("Test 10.3 Add like to a tripn --Server err", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Add like to a trip --Server err");
        const res = yield (0, supertest_1.default)(app_1.default)
            .post(`/trips/likes/${nonExistingId}12`)
            .set("Authorization", "JWT " + accessToken)
            .send({
            owner: "David",
        });
        expect(res.statusCode).toBe(500);
    }));
});
