const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { startServerWithUrl } = require("../app");
const { disconnectDB } = require("../db/connect");
const { deleteImage } = require("../modules/cloudinaryApis/deleteFile");
const User = require("../models/User");
const Post = require("../models/Posts");
const { StatusCodes } = require("http-status-codes");
const fs = require("fs");
const path = require("path");
jest.setTimeout(20000);

describe("POST APIS", () => {
  let app;
  let currentUser;
  const userObject = {
    username: "testusername",
    email: "testemail@gmail.com",
    firebaseUid: "firebasetestuid",
    registrationToken: "fakeregtoken",
  };

  beforeAll(async () => {
    const mongoTestServer = await MongoMemoryServer.create();
    app = startServerWithUrl(mongoTestServer.getUri());
  });

  afterAll(async () => {
    await disconnectDB();
  });
  beforeEach(async () => {
    // Set up a test user
    currentUser = await User.create(userObject);
  });
  afterEach(async () => {
    // await Post.deleteMany({});
    await User.deleteMany({});
  });

  it("creates a new blog post", async () => {
    // Set up the request body with a file
    const file = fs.readFileSync(path.join(__dirname, "house.png"));
    const reqBody = {
      title: "Test post",
      body: "This is a test post",
      category: "Test category",
      userFirebaseId: currentUser.firebaseUid,
      userName: currentUser.username,
    };

    // Make the request to the API endpoint
    const response = await request(app)
      .post("/api/v1/posts")
      .field("title", reqBody.title)
      .field("body", reqBody.body)
      .field("category", reqBody.category)
      .field("userFirebaseId", reqBody.userFirebaseId)
      .field("userName", reqBody.userName)
      .attach("photo", file, "house.png");

    expect(response.statusCode).toBe(StatusCodes.CREATED);

    // Check that the user's post count was incremented
    const updatedUser = await User.findOne({
      firebaseUid: currentUser.firebaseUid,
    });
    expect(updatedUser.postCount).toBe(1);

    // Clean up by deleting the test image
    await deleteImage(response.body.imageUrl);
  });
});
