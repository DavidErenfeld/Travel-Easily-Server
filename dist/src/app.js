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
const file_route_1 = __importDefault(require("./routes/file_route"));
const user_route_1 = __importDefault(require("./routes/user_route"));
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
app.use("/file", file_route_1.default);
app.use("/users", user_route_1.default);
app.use("/public", express_1.default.static("public"));
exports.default = app;
/////////////////////////////
// import express from "express";
// import fs from "fs";
// import https from "https";
// import dotenv from "dotenv";
// dotenv.config();
// import mongoose from "mongoose";
// import bodyParser from "body-parser";
// import tripsRoute from "./routes/trips_route";
// import authRoute from "./routes/auth_route";
// import cors from "cors";
// import fileRoute from "./routes/file_route";
// import userRoute from "./routes/user_route";
// const app = express();
// app.use(cors());
// // בחירת בסיס הנתונים בהתאם לסביבת הריצה
// const dbUri =
//   process.env.NODE_ENV === "test"
//     ? process.env.TEST_DB_URI
//     : process.env.DB_URL;
// // Connect to the db
// mongoose.connect(dbUri);
// const db = mongoose.connection;
// db.on("error", (error) => console.error(error));
// db.once("open", () =>
//   console.log(
//     `Connected to ${process.env.NODE_ENV === "test" ? "Test " : ""}Database`
//   )
// );
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/trips", tripsRoute);
// app.use("/auth", authRoute);
// app.use("/file", fileRoute);
// app.use("/users", userRoute);
// app.use("/public", express.static("public"));
// // הגדרת HTTPS
// const sslOptions = {
//   key: fs.readFileSync("C:/Users/97250/Desktop/HTTPS/server.key"), // שנה לנתיב הנכון
//   cert: fs.readFileSync("C:/Users/97250/Desktop/HTTPS/server.cert"), // שנה לנתיב הנכון
// };
// // האזנה על HTTPS במקום HTTP
// https.createServer(sslOptions, app).listen(process.env.PORT, () => {
//   console.log(`Example app listening at https://localhost:${process.env.PORT}`);
// });
// export default app;
//# sourceMappingURL=app.js.map