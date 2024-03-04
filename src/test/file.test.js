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
// Delete DB before test
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("jest beforeAll");
}));
// Close DB after test
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe("--File Tests--", () => {
    test("upload file", () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = `${__dirname}/user.png`;
        try {
            const postResponse = yield (0, supertest_1.default)(app_1.default)
                .post("/file?file=123.png")
                .attach("file", filePath);
            expect(postResponse.statusCode).toEqual(200);
            let url = postResponse.body.url;
            console.log("url =  ", url);
            url = url.replace(/^.*\/\/[^/]+/, "");
            console.log("URL after replace  ", url);
            const getResponse = yield (0, supertest_1.default)(app_1.default).get(url);
            expect(getResponse.statusCode).toEqual(200);
        }
        catch (err) {
            expect(1).toEqual(2);
        }
    }));
});
