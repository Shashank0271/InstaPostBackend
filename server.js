const server = require('./app');
// console.log(server);
server.startServerWithUrl(process.env.MONGO_URI);