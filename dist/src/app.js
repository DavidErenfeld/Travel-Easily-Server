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
const cors_1 = __importDefault(require("cors"));
const file_routes_1 = __importDefault(require("./routes/file_routes"));
app.use((0, cors_1.default)());
// בחירת בסיס הנתונים בהתאם לסביבת הריצה
const dbUri = process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URI
    : process.env.DB_URL;
// Connect to the db
mongoose_1.default.connect(dbUri);
const db = mongoose_1.default.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log(`Connected to ${process.env.NODE_ENV === "test" ? "Test " : ""}Database`));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/trips", trips_route_1.default);
app.use("/auth", auth_route_1.default);
app.use("/file", file_routes_1.default);
app.use("/public", express_1.default.static("public"));
exports.default = app;
//# sourceMappingURL=app.js.map