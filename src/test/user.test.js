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
const users_model_1 = __importDefault(require("../models/users_model"));
const user = {
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
let accessToken;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield users_model_1.default.deleteMany();
    const responseRegister = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(user);
    user._id = responseRegister.body._id;
    const responseLogin = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send(user);
    accessToken = responseLogin.body.accessToken;
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe("--User Tests--", () => {
    const nonExistingId = new mongoose_1.default.Types.ObjectId();
    test("Test 1 update user by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/users/${user._id}`)
            .set("Authorization", "JWT " + accessToken)
            .send({
            userName: "David",
            imgUrl: "aaa/aaaaa",
        });
        expect(res.status).toBe(200);
        expect(res.body.userName).toBe("David");
        expect(res.body.imgUrl).toBe("aaa/aaaaa");
    }));
    test("Test 2 update user by id -- fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/users/${nonExistingId}`)
            .set("Authorization", "JWT " + accessToken)
            .send({
            userName: "David",
            imgUrl: "aaa/aaaaa",
        });
        expect(res.status).toBe(404);
    }));
    test("Test 3 update user by id -- fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/users/${nonExistingId}6`)
            .set("Authorization", "JWT " + accessToken)
            .send({
            userName: "David",
            imgUrl: "aaa/aaaaa",
        });
        expect(res.status).toBe(500);
    }));
});
