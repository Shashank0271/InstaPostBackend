const server = require("./app");
const { createHttpServer } = require("./httpserver");
const app = server.startServerWithUrl(process.env.MONGO_URL);
createHttpServer(app);
