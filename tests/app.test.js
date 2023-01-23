require('../db/connect');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');

describe("user apis", () => {
    beforeAll(async () => {
        const mongoserver = await MongoMemoryServer.create();
        await mongoose.connect(mongoserver.getUri());
    })
    afterAll(async () => {

    })  
    describe("USER POST/---- ", () => {
        //should save the user into the database 
        //should response with a json object containing the user
        it("on giving details ,should responde with a 200 status code", async () => {
            await User.deleteOne({ firebaseUid: "firebasetestuid" });
            const response = await request(app).post('/api/v1/users').send({
                username: "testusername",
                email: "testemail@gmail.com",
                firebaseUid: "firebasetestuid",
                registrationToken: "fakeregtoken",
            });
            await expect(response.statusCode).toBe(200);
            expect(response.body).not.toBeNull;
        });
    });

})