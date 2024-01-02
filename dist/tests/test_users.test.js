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
const app_1 = __importDefault(require("../src/app"));
const mongoose_1 = __importDefault(require("mongoose"));
const users_model_1 = __importDefault(require("../src/models/users_model"));
//Delete DB before test
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("jest beforeAll");
    yield users_model_1.default.deleteMany();
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
    const addNewUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/").send(user);
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual("OK");
    });
    const updateUserById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).findByIdAndUpdate(_id);
    });
    test("1 Test get all users - empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test get all users -- 0 users");
        //Test if status cod == 200
        const response = yield (0, supertest_1.default)(app_1.default).get("/");
        expect(response.statusCode).toEqual(200);
        //Test if the collection is empty
        const data = response.body;
        expect(data.length).toEqual(0);
    }));
    test("Test 2 add new user", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test add new user");
        yield addNewUser(user1);
    }));
    test("3 Test get all users - 1 user", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test get all users -- 1 user");
        //Test if status cod == 200
        const response = yield (0, supertest_1.default)(app_1.default).get("/");
        expect(response.statusCode).toEqual(200);
        //Test if the collection is empty
        const data = response.body;
        expect(data.length).toEqual(1);
        const user = data[0];
        console.log(user.email);
        console.log(user.password);
        expect(user.email).toBe(user1.email);
        expect(user.password).toBe(user1.password);
    }));
    test("Test 4 update user by id", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("update user by id");
        const response = yield (0, supertest_1.default)(app_1.default).get("/");
        const data = response.body;
        const user = data[0];
        // console.log(`=============${user._id}===============`);
        const res = yield (0, supertest_1.default)(app_1.default).put(`/${user._id}`).send({
            _id: user._id,
            email: "www@gmail.com",
            password: "123123123",
        });
        expect(res.statusCode).toBe(200);
    }));
    test("Test 5 update user by id-- fail", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("update user by id-- fail");
        const response = yield (0, supertest_1.default)(app_1.default).get("/");
        const data = response.body;
        const user = data[0];
        // console.log(`=============${user._id}===============`);
        const res = yield (0, supertest_1.default)(app_1.default).put(`/${user._id}2`).send({
            _id: user._id,
            email: "www@gmail.com",
            password: "123123123",
        });
        expect(res.statusCode).toBe(500);
    }));
    test("Test 6 delete user by id", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("delete user by id");
        const response = yield (0, supertest_1.default)(app_1.default).get("/");
        const data = response.body;
        const user = data[0];
        // console.log(`=============${user._id}===============`);
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/${user._id}`).send();
        expect(res.statusCode).toBe(200);
    }));
    test("Test 7 get all users - empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Test get all users == 0");
        //Test if status cod == 200
        const response = yield (0, supertest_1.default)(app_1.default).get("/");
        expect(response.statusCode).toEqual(200);
        //Test if the collection is empty
        const data = response.body;
        expect(data.length).toEqual(0);
    }));
});
//# sourceMappingURL=test_users.test.js.map