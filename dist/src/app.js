"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const trips_route_1 = __importDefault(require("./routes/trips_route"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
// Connect to the db
mongoose_1.default.connect(process.env.DB_URL);
const db = mongoose_1.default.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/trips", trips_route_1.default);
app.use("/auth", auth_route_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map