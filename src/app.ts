import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import tripsRoute from "./routes/trips_route";
import authRoute from "./routes/auth_route";
import fileRoute from "./routes/file_route";
import userRoute from "./routes/user_route";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();

const dbUri =
  process.env.NODE_ENV === "test"
    ? process.env.DB_URL
    : process.env.TEST_DB_URL;
if (!dbUri) {
  throw new Error(
    `The uri parameter to "openUri()" must be a string, got "undefined". ${dbUri}...................................................`
  );
}
console.log(`Connecting to database with URL: ${dbUri}`);
mongoose
  .connect(dbUri)
  .then(() => console.log("Connected successfully to database"))
  .catch((err) => console.error("Database connection error:", err));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express API with Swagger",
      version: "1.0.0",
      description: "A simple CRUD API application",
    },
    servers: [
      { url: "https://enigmatic-island-56921-258869278475.herokuapp.com/" },
    ],
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
