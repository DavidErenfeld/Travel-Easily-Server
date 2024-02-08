import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import tripsRoute from "./routes/trips_route";
import authRoute from "./routes/auth_route";
import cors from "cors";
import fileRoute from "./routes/file_route";
import userRoute from "./routes/user_route";
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
app.use("/auth", authRoute);
app.use("/file", fileRoute);
app.use("/users", userRoute);
app.use("/public", express.static("public"));
export default app;

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
