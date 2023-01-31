const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const startServer = require("../app");
const { disconnectDB } = require("../db/connect");
// import * as errorHandler from "../middleware/error-handler";
const errorHandler = require("../middleware/error-handler");

describe("user apis", () => {
  let app;
  beforeAll(async () => {
    const mongoTestServer = await MongoMemoryServer.create();
    app = startServer(mongoTestServer.getUri());
  });
  afterAll(async () => {
    await disconnectDB();
  });
  describe("USER POST/---- ", () => {
    it("on giving details ,should responde with a 200 status code", async () => {
      const response = await request(app).post("/api/v1/users").send({
        username: "testusername",
        email: "testemail@gmail.com",
        firebaseUid: "firebasetestuid",
        registrationToken: "fakeregtoken",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).not.toBeNull;
    });
    it("should not accept incomplete details", async () => {
      const { statusCode, body } = await request(app)
        .post("/api/v1/users")
        .send({
          username: "testusername",
          email: "testemailgail.com",
          registrationToken: "fakeregtoken",
        });
      expect(statusCode).not.toBe(200);
      expect(body.msg).toBe("user validation failed");
    });
    it("should not insert duplicate emails", async () => {
      await request(app).post("/api/v1/users").send({
        username: "testusername",
        email: "testemail@gmail.com",
        firebaseUid: "firebasetestuid",
        registrationToken: "fakeregtoken",
      });
      const { statusCode, body } = await request(app)
        .post("/api/v1/users")
        .send({
          username: "testusername2",
          email: "testemail@gmail.com",
          firebaseUid: "firebasetestuid2",
          registrationToken: "fakeregtoken2",
        });
      expect(statusCode).toBe(500);
      expect(body.msg).toBe("Something went wrong, please try again");
    });
  });
});
