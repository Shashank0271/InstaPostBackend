const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const startServer = require("../app");
const { disconnectDB } = require("../db/connect");
const User = require("../models/User");
const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");

describe("POST APIS", () => {
  let app;
  
  const postObject = {
    
  }

  beforeAll(async () => {
    const mongoTestServer = await MongoMemoryServer.create();
    app = startServer(mongoTestServer.getUri());
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it("should insert the post" , async()=>{

  });
  it("should fetch the required post given id" , async()=>{
    
  })
});
