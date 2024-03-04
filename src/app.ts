import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();

import tripsRoute from "./routes/trips_route";
import authRoute from "./routes/auth_route";
import fileRoute from "./routes/file_route";
import userRoute from "./routes/user_route";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
const dbUri =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URI
    : process.env.DB_URL;
mongoose.connect(dbUri);
const db = mongoose.connection;
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

    servers: [{ url: "https://10.10.248.179" }],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/trips", tripsRoute);
app.use("/auth", authRoute);
app.use("/file", fileRoute);
app.use("/users", userRoute);
app.use("/public", express.static("public"));

export default app;
