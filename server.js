const startServer = require('./app');
startServer(process.env.MONGO_URI);