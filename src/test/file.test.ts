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
    try {
      const postResponse = await request(app)
        .post("/file?file=123.png")
        .attach("file", filePath);

      expect(postResponse.statusCode).toEqual(200);

      let url = postResponse.body.url;
      console.log("url =  ", url);

      url = url.replace(/^.*\/\/[^/]+/, "");
      console.log("URL after replace  ", url);

      const getResponse = await request(app).get(url);

      expect(getResponse.statusCode).toEqual(200);
    } catch (err) {
      expect(1).toEqual(2);
    }
  });
});
