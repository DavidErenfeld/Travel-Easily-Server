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
};
let accessToken;
//Delete DB before test
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("jest beforeAll");
    yield trips_model_1.default.deleteMany();
    yield users_model_1.default.deleteMany({ email: user.email });
    const response1 = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(user);
    user._id = response1.body._id;
    yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(user);
    const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send(user);
    accessToken = response.body.accessToken;
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
describe("--Auth Tests--", () => {
    const trip1 = {
        owner: "David",
        typeTraveler: "type Traveler",
        country: "Country",
        typeTrip: "type Trip",
        numOfDays: 3,
        tripDescription: ["aa", "bb"],
    };
    const trip2 = {
        owner: "moshe",
        typeTraveler: "type Traveler 2",
        country: "Country 2",
        typeTrip: "type Trip 2",
        numOfDays: 3,
        tripDescription: ["tripDescription 2", "tripDescription 2"],
    };
    //FUNCTION  Add a new student and send to the DB
    const addNewUser = (trip) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/trips")
            .set("Authorization", "JWT " + accessToken)
            .send(trip);
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual("OK");
    });
    test("1 Test get all trips - empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test get all trips -- 0 trips");
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        expect(response.statusCode).toEqual(200);
        const data = response.body;
        expect(data.length).toEqual(0);
    }));
    test("Test 2 add new trip", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test add new trip");
        yield addNewUser(trip1);
    }));
    test("3 Test get all trips - 1 trip", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test get all trips -- 1 trip");
        //Test if status cod == 200
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        expect(response.statusCode).toEqual(200);
        //Test if the collection is empty
        const data = response.body;
        expect(data.length).toEqual(1);
        const trip = data[0];
        expect(trip.owner).toBe(user._id);
        expect(trip.typeTraveler).toBe(trip1.typeTraveler);
        expect(trip.country).toBe(trip1.country);
        expect(trip.typeTrip).toBe(trip1.typeTrip);
        expect(trip.numOfDays).toBe(trip1.numOfDays);
        expect(trip.tripDescription[0]).toBe(trip1.tripDescription[0]);
    }));
    test("Test 4 update trip by id", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("update trip by id");
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        const data = response.body;
        const updateTrip = data[0];
        console.log(`=====update========${updateTrip._id}=======update========`);
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/trips/${updateTrip._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send({
            _id: updateTrip._id,
            owner: "update owner",
            country: "update contry",
            numOfDays: 1,
            tripDescription: "update tripDescription",
        });
        expect(res.status).toEqual(200);
    }));
    test("Test 5 update trip by id-- fail", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("update user by id-- fail");
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        const data = response.body;
        const updateTrip = data[0];
        // console.log(`=============${user._id}===============`);
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
    test("Test 6 add new trip and get all trips - 2 trips", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test add new trip");
        yield addNewUser(trip2);
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
        const trip = data[0];
        // console.log(`=============${user._id}===============`);
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/trips/${trip._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send();
        expect(res.statusCode).toBe(200);
    }));
    test("Test 7 get all trips - 1 trip", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test get all trips -- 1 trip");
        //Test if status cod == 200
        const response = yield (0, supertest_1.default)(app_1.default).get("/trips");
        expect(response.statusCode).toEqual(200);
        //Test if the collection is empty
        const data = response.body;
        expect(data.length).toEqual(1);
    }));
});
//# sourceMappingURL=test_users.test.js.map