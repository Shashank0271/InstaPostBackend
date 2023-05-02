let server;
const port = process.env.PORT || 8000 ;

function createHttpServer(app) {
  server = app.listen(
    port,
    console.log(`The server PID=${process.pid} is listening on port ${port}...`)
  );
}
function tearDownHttpServer() {
  server.close();
}

module.exports = {
  createHttpServer,
  tearDownHttpServer,
};
