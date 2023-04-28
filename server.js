const server = require("./app");

server.startServerWithUrl(process.env.MONGO_URL);
