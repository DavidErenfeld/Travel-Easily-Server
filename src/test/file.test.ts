import request from "supertest";
import app from "../app";
import mongoose from "mongoose";

// Delete DB before test
beforeAll(async () => {
  console.log("jest beforeAll");
});

// Close DB after test
afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("--File Tests--", () => {
  test("upload file", async () => {
    const filePath = `${__dirname}/user.png`;
    console.log("כתובת הקובץ להעלאה: ", filePath);

    try {
      const postResponse = await request(app)
        .post("/file?file=123.png")
        .attach("file", filePath);
      console.log("תגובת השרת לבקשת POST: ", postResponse.body);

      expect(postResponse.statusCode).toEqual(200);

      let url = postResponse.body.url;
      console.log("URL שהתקבל: ", url);

      url = url.replace(/^.*\/\/[^/]+/, "");
      console.log("URL לאחר ההתאמה: ", url);

      const getResponse = await request(app).get(url);
      console.log("תגובת השרת לבקשת GET: ", getResponse.statusCode);

      expect(getResponse.statusCode).toEqual(200);
    } catch (err) {
      console.log("שגיאה במהלך המבחן: ", err);
      expect(1).toEqual(2);
    }
  });
});
