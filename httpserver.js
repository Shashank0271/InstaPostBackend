let server;
const port = process.env.PORT || 8000;

function createHttpServer(app) {
  server = app.listen(
    port,
    console.log(`The server PID=${process.pid} is listening on port ${port}...`)
  );
}

function tearDownHttpServer() {
  //this function was introduced for the purpose of testing , so that concurrent tests dont cause problems
  server.close();
}

module.exports = {
  createHttpServer,
  tearDownHttpServer,
};
