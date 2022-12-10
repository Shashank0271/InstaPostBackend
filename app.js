require('express-async-errors');
require('dotenv').config();

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const errorHandlerMiddleware = require('./middleware/error-handler');
const posts = require('./routes/posts')
const port = process.env.PORT || 4000;

app.use(express.json());
app.use('/api/v1/posts',posts);
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`The server is listening on port ${port}...`));
    }
    catch (error) {
        console.log(error);
    }
}
start();