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
let accessToken;
let refreshToken;
let newRefreshToken;
let accessToken1;
let refreshToken1;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield users_model_1.default.deleteMany();
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe("--Auth Tests--", () => {
    test("Test Register", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(user);
        expect(response.statusCode).toBe(200);
    }));
    test("Test Register exist email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(user);
        expect(response.statusCode).toBe(400);
    }));
    test("Test Register missing password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send({
            email: "test@test.com",
        });
        expect(response.statusCode).toBe(400);
    }));
    test("Test Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send(user);
        expect(response.statusCode).toBe(200);
        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;
        expect(accessToken).toBeDefined();
    }));
    test("Test Login --file email or password is null", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send(user2);
        expect(response.statusCode).toBe(400);
    }));
    test("Test Login --file bad email or password", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send(user3);
        expect(response.statusCode).toBe(400);
    }));
    test("Test Login --file password is not match", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send(user4);
        expect(response.statusCode).toBe(400);
    }));
    test("Test forbidden access without token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/trips");
        expect(response.statusCode).toBe(401);
    }));
    test("Test access with valid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get("/trips")
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    }));
    test("Test access with invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/trips")
            .set("Authorization", "JWT 1" + accessToken);
        expect(response.statusCode).toBe(401);
    }));
    test("Test refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/auth/refresh")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        newRefreshToken = response.body.refreshToken;
    }));
    test("Test refresh token 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/auth/refresh")
            .set("Authorization", "JWT " + newRefreshToken)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        newRefreshToken = response.body.refreshToken;
    }));
    test("Test refresh token 3", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/auth/refresh")
            .set("Authorization", "JWT " + newRefreshToken)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        newRefreshToken = response.body.refreshToken;
    }));
    test("logout test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response1 = yield (0, supertest_1.default)(app_1.default)
            .post("/auth/logout")
            .set("Authorization", "JWT " + newRefreshToken)
            .send();
        expect(response1.status).toEqual(200);
    }));
    test("Test refresh token 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/auth/refresh")
            .set("Authorization", "JWT " + newRefreshToken)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        newRefreshToken = response.body.refreshToken;
    }));
    test("Test refresh token 3", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/auth/refresh")
            .set("Authorization", "JWT " + newRefreshToken)
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        newRefreshToken = response.body.refreshToken;
    }));
    test("logeout test --file token is null", () => __awaiter(void 0, void 0, void 0, function* () {
        const response1 = yield (0, supertest_1.default)(app_1.default)
            .post("/auth/logout")
            .set("Authorization", "JWT InvalidTokenHere")
            .send();
        expect(response1.status).toEqual(403);
    }));
    test("Test Register 2", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/register").send(user1);
        expect(response.statusCode).toBe(200);
    }));
    test("Test Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).post("/auth/login").send(user1);
        expect(response.statusCode).toBe(200);
        accessToken1 = response.body.accessToken;
        refreshToken = response.body.refreshToken;
        expect(accessToken1).toBeDefined();
    }));
    test("Test access after timeout of token", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.setTimeout(10000);
        yield new Promise((resolve) => setTimeout(() => resolve("done"), 4000));
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/trips")
            .set("Authorization", "JWT " + accessToken1);
        expect(response.statusCode).not.toBe(200);
    }));
    test("Test double use of refresh token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post("/auth/refresh")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(response.statusCode).toEqual(200);
        const response1 = yield (0, supertest_1.default)(app_1.default)
            .get("/auth/refresh")
            .set("Authorization", "JWT " + refreshToken)
            .send();
        expect(response1.statusCode).not.toEqual(200);
    }));
});
