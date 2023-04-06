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

jest.setTimeout(10000);

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
    await User.deleteMany({});
    // await Post.deleteMany({});
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

    // Clean up cloudinary by deleting the test image
    await deleteImage(response.body.imageUrl);
  }, 50000);

  it("should fetch all the posts", async () => {
    //inserting in to the database :
    await Post.insertMany([
      {
        title: "Test post1",
        body: "This is a test post(1)",
        category: "First Test category",
        userFirebaseId: currentUser.firebaseUid,
        userName: currentUser.username,
      },
      {
        title: "Test post2",
        body: "This is a test post(2)",
        category: "Second Test category",
        userFirebaseId: currentUser.firebaseUid,
        userName: currentUser.username,
      },
    ]);

    // Make the request to the API endpoint
    const { statusCode, body } = await request(app).get("/api/v1/posts");
    expect(statusCode).toBe(StatusCodes.OK);
    expect(body).toHaveLength(2);

    expect(body[0]).toHaveProperty("title", "Test post1");
    expect(body[0]).toHaveProperty("body", "This is a test post(1)");
    expect(body[0]).toHaveProperty("category", "First Test category");
    expect(body[0]).toHaveProperty("userFirebaseId", currentUser.firebaseUid);
    expect(body[0]).toHaveProperty("userName", currentUser.username);

    expect(body[1]).toHaveProperty("title", "Test post2");
    expect(body[1]).toHaveProperty("body", "This is a test post(2)");
    expect(body[1]).toHaveProperty("category", "Second Test category");
    expect(body[1]).toHaveProperty("userFirebaseId", currentUser.firebaseUid);
    expect(body[1]).toHaveProperty("userName", currentUser.username);
  });

  it("should fetch only the current users post", async () => {
    //inserting posts into the database
    await Post.insertMany([
      {
        title: "Test post2",
        body: "This is a test post(2)",
        category: "Second Test category",
        userFirebaseId: "someOTherFID",
        userName: currentUser.username,
      },
    ]);

    //Making the request to the API endpoint
    const { statusCode, body } = await request(app).get(
      `/api/v1/posts/${currentUser.firebaseUid}`
    );

    expect(statusCode).toBe(StatusCodes.OK);
    expect(body).toHaveLength(1);
    expect(body[0]).toHaveProperty("userFirebaseId", currentUser.firebaseUid);
  });
});
