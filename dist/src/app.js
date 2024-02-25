"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// יבוא ראוטרים
const trips_route_1 = __importDefault(require("./routes/trips_route"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const file_route_1 = __importDefault(require("./routes/file_route"));
const user_route_1 = __importDefault(require("./routes/user_route"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const dbUri = process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URI
    : process.env.DB_URL;
mongoose_1.default.connect(dbUri);
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected successfully to database");
});
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express API with Swagger",
            version: "1.0.0",
            description: "A simple CRUD API application",
        },
        servers: [{ url: "http://localhost:3000" }],
    },
    apis: ["./src/routes/*.ts"], // נתיב לקבצים שבהם יש הגדרות swagger
};
const specs = (0, swagger_jsdoc_1.default)(options);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// ראוטים
app.use("/trips", trips_route_1.default);
app.use("/auth", auth_route_1.default);
app.use("/file", file_route_1.default);
app.use("/users", user_route_1.default);
app.use("/public", express_1.default.static("public"));
exports.default = app;
//# sourceMappingURL=app.js.map