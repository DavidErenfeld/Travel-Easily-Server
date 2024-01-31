import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import tripsRoute from "./routes/trips_route";
import AuthRoute from "./routes/auth_route";
import cors from "cors";
import fileRoute from "./routes/file_routes";
app.use(cors());
// בחירת בסיס הנתונים בהתאם לסביבת הריצה
const dbUri =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URI
    : process.env.DB_URL;

// Connect to the db
mongoose.connect(dbUri);
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () =>
  console.log(
    `Connected to ${process.env.NODE_ENV === "test" ? "Test " : ""}Database`
  )
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/trips", tripsRoute);
app.use("/auth", AuthRoute);
app.use("/file", fileRoute);
app.use("/public", express.static("public"));
export default app;
