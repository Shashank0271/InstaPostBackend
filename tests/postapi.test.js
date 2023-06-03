const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { startServerWithUrl } = require("../app");
const { disconnectDB } = require("../db/connect");
const { deleteImage } = require("../modules/cloudinaryApis/deleteFile");
const { createHttpServer, tearDownHttpServer } = require("../httpserver");
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
    createHttpServer(app);
    currentUser = await User.create(userObject);
  });

  afterEach(async () => {
    tearDownHttpServer();
    await User.deleteMany({});
    // await Post.deleteMany({});
  });

  it("creates a new blog post", async () => {
    //make a new user and make him to follow this user
    const followerObject = {
      username: "followerusername",
      email: "followeremail@gmail.com",
      firebaseUid: "followerfirebasetestuid",
      registrationToken: "followerfakeregtoken",
    };

    //insert in db
    await User.create(followerObject);
    await request(app).post("/api/v1/users/follow").send({
      currentUserFid: followerObject.firebaseUid,
      followedUserFid: userObject.firebaseUid,
      currentUserToken: followerObject.registrationToken,
    });

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
    expect(body).toHaveLength(3);

    expect(body[1]).toHaveProperty("title", "Test post1");
    expect(body[1]).toHaveProperty("body", "This is a test post(1)");
    expect(body[1]).toHaveProperty("category", "First Test category");
    expect(body[1]).toHaveProperty("userFirebaseId", currentUser.firebaseUid);
    expect(body[1]).toHaveProperty("userName", currentUser.username);

    expect(body[2]).toHaveProperty("title", "Test post2");
    expect(body[2]).toHaveProperty("body", "This is a test post(2)");
    expect(body[2]).toHaveProperty("category", "Second Test category");
    expect(body[2]).toHaveProperty("userFirebaseId", currentUser.firebaseUid);
    expect(body[2]).toHaveProperty("userName", currentUser.username);
  });

  it("should fetch only the current users post", async () => {
    //inserting posts into the database
    await Post.insertMany([
      {
        title: "Test post3",
        body: "This is a test post(3)",
        category: "Second Test category3",
        userFirebaseId: "someOTherFID45",
        userName: currentUser.username,
      },
    ]);

    //Making the request to the API endpoint
    const { statusCode, body } = await request(app).get(
      `/api/v1/posts/${currentUser.firebaseUid}`
    );

    expect(statusCode).toBe(StatusCodes.OK);
    expect(body).toHaveLength(3);
    expect(body[0]).toHaveProperty("userFirebaseId", currentUser.firebaseUid);
  });

  it("should fetch the post specified by the postId", async () => {
    const testPost = await Post.findOne({ title: "Test post" });
    const { statusCode, body } = await request(app).get(
      `/api/v1/posts/fetchpost/${testPost["_id"].toString()}`
    );
    expect(statusCode).toBe(StatusCodes.OK);
    expect(body["_id"].toString()).toBe(testPost["_id"].toString());
  });
  // it("should add the post id of the liked post to ")
});
