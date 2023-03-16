const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const startServer = require("../app");
const { disconnectDB } = require("../db/connect");

const userObject = {
  username: "testusername",
  email: "testemail@gmail.com",
  firebaseUid: "firebasetestuid",
  registrationToken: "fakeregtoken",
};

describe("USER APIS", () => {
  let app;
  beforeAll(async () => {
    const mongoTestServer = await MongoMemoryServer.create();
    app = startServer(mongoTestServer.getUri());
  });
  afterAll(async () => {
    await disconnectDB();
  });

  describe("USER POST/---- ", () => {
    it("should responde with a 200 status code , respond with a new user", async () => {
      const response = await request(app)
        .post("/api/v1/users")
        .send(userObject);
      expect(response.statusCode).toBe(200);
      expect(response.body).not.toBeNull;
      expect(response.body.newUser.username).toBe(userObject.username);
      expect(response.body.newUser.email).toBe(userObject.email);
      expect(response.body.newUser.firebaseUid).toBe(userObject.firebaseUid);
      expect(response.body.newUser.registrationToken).toBe(
        userObject.registrationToken
      );
      expect(response.body.newUser.postIds.length).toBe(0);
      expect(response.body.newUser.followersTokens.length).toBe(0);
      expect(response.body.newUser.followers.length).toBe(0);
      expect(response.body.newUser.following.length).toBe(0);
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
      await request(app).post("/api/v1/users").send(userObject);
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

  describe("USER get", () => {
    const firebaseUid = "firebasetestuid";

    it("should return the user given a valid firebaseUID", async () => {
      const { statusCode, body } = await request(app).get(
        `/api/v1/users/${firebaseUid}`
      );
      expect(statusCode).toBe(200);
      expect(body.username).toBe(userObject.username);
      expect(body.email).toBe(userObject.email);
      expect(body.firebaseUid).toBe(userObject.firebaseUid);
      expect(body.registrationToken).toBe(userObject.registrationToken);
      expect(body.postIds.length).toBe(0);
      expect(body.followersTokens.length).toBe(0);
      expect(body.followers.length).toBe(0);
      expect(body.following.length).toBe(0);
    });

    it("should give a response with 404 status code when Users FID is not present in DB", async () => {
      const { statusCode, body } = await request(app).get(
        `/api/v1/users/randomFI`
      );
      expect(statusCode).toBe(404);
      console.log(body);
      expect(body.msg).toBe("user does not exist");
    });
  });

  //TODO : add tests for USER update
  describe("USER update", () => {});

  //TODO : add tests for follow user
  describe("USER follow", () => {});
});
