const server = require("./app");
const { createHttpServer } = require("./httpserver");
const app = server.startServerWithUrl(process.env.MONGO_URL); //connects to DB with given url and returns the express app instance
createHttpServer(app); //sets up http server using the app instance returned above
