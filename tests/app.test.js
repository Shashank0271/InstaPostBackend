const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const startServer = require("../app");
const { disconnectDB } = require("../db/connect");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

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
    it("should return the user given a valid firebaseUID", async () => {
      const { statusCode, body } = await request(app).get(
        `/api/v1/users/${userObject.firebaseUid}`
      );

      expect(statusCode).toBe(200);
      expect(body).not.toBeNull;
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
      expect(body.msg).toBe("user does not exist");
    });
  });

  describe("USER update", () => {
    it("should return with 200 status code", async () => {
      const { statusCode, body } = await request(app)
        .patch("/api/v1/users")
        .send({
          firebaseUid: userObject.firebaseUid,
          username: "uname",
        });

      expect(statusCode).toBe(200);
      expect(body.message).toBe("profile updated successfully");

      const updatedUser = await User.findOne({
        firebaseUid: userObject.firebaseUid,
      });
      expect(updatedUser.username).toBe("uname");
    });

    it("should not modify username if its an empty string", async () => {
      const { statusCode, body } = await request(app)
        .patch("/api/v1/users")
        .send({
          firebaseUid: userObject.firebaseUid,
          username: "",
        });
      expect(statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(body.message).toBe("username needs to be provided");
    });
  });

  //TODO : add tests for follow user
  describe("USER follow", () => {
    it("should update the follower and following parameters when a user follows another", async () => {
      //create a new user in the database
      const createUserResponse = await request(app).post("/api/v1/users").send({
        username: "newUser",
        email: "newuser@gmail.com",
        firebaseUid: "newuserfid",
        registrationToken: "fakeregtoken2",
      });
      const { newUser } = createUserResponse.body;

      //make the current userObject follow the new user
      const { statusCode, body } = await request(app)
        .post("/api/v1/users/follow")
        .send({
          currentUserFid: userObject.firebaseUid,
          followedUserFid: newUser.firebaseUid,
        });

      expect(statusCode).toBe(StatusCodes.OK);
      expect(body.message).toBe("user followed successfully");

      currentUser = await User.findOne({
        firebaseUid: userObject.firebaseUid,
      });
      followedUser = await User.findOne({
        firebaseUid: newUser.firebaseUid,
      });
      expect(currentUser).not.toBeNull;
      expect(followedUser).not.toBeNull;
    });
    let currentUser, followedUser;
    it("the current users following list should be updated with an increase of 1 in length", () => {
      expect(currentUser.following.length).toBe(1);
    });

    it("the last item in the list should be the firebaseuid of the new user", () => {
      expect(currentUser.following[currentUser.following.length - 1]).toBe(
        followedUser.firebaseUid
      );
    });

    it("the new users follers list should be updated with an increase of 1 in length", () => {});
    it("the last item in the list should be the firebaseuid of the current user", () => {});
  });
});

/*{
    "message": "user created successfully",
    "newUser": {
        "username": "Shashangggk",
        "email": "ssingh02cgc71@gmail.com",
        "firebaseUid": "firebasgggeUid",
        "registrationToken": "dummgy reg token",
        "postIds": [],
        "followersTokens": [],
        "followers": [],
        "following": [],
        "_id": "64158d50cb3f2b2263cd5db0",
        "__v": 0
    }
}*/
