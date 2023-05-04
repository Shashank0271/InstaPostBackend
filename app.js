require("express-async-errors");
require("dotenv").config();
require("./modules/fcm/fcm").initFcm();
const fileUpload = require("express-fileupload");
const { setupCloudConfig } = require("./modules/cloudinaryApis/connect");
const express = require("express");
const app = express();
const { connectDB } = require("./db/connect");
const { errorHandlerMiddleware } = require("./middleware/error-handler");
const rateLimit = require("express-rate-limit");
const posts = require("./routes/posts");
const users = require("./routes/users");
const os = require("os");
const cluster = require("cluster");

/*
TODO : FEATURES TO ADD : 
2)secure apis using firebase user token (middleware)
3)add comments section to the application
(make sep collection for comments and use postid to identify comments for a certain post)
5)try to deploy on kubernetes
*/

//port
const port = process.env.PORT || 4000;

//middleware

app.set("trust proxy", true);

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests within above time interval
    message: "Too many requests, please try again later",
  })
);

app.get("/", function (req, res) {
  console.log("this is a log message");
  res.send("success");
});

app.use(express.json());
app.use("/api/v1/posts", posts);
app.use("/api/v1/users", users);
app.use(errorHandlerMiddleware); //cloudinary
setupCloudConfig();
let server;
module.exports.startServerWithUrl = (databaseUrl) => {
  //database
  const start = async () => {
    try {
      await connectDB(databaseUrl);
      // if (cluster.isMaster) {
      //   for (let i = 0; i < numCpus; i++) {
      //     cluster.fork();
      //   }
      // } else {

      //------UNCOMMENT
      // server = app.listen(
      //   port,
      //   console.log(
      //     `The server PID=${process.pid} is listening on port ${port}...`
      //   )
      // );
      //------UNCOMMENT
      // createHttpServer(app);

      // }
    } catch (error) {
      console.log(error);
    }
  };

  start();
  return app;
};

module.exports.server = server;
