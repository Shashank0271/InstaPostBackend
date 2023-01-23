require('express-async-errors');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const { setupCloudConfig } = require('./modules/cloudinaryApis/connect');
const express = require('express');
const app = express();
const {connectDB} = require('./db/connect');
const errorHandlerMiddleware = require('./middleware/error-handler');
const posts = require('./routes/posts');
const users = require('./routes/users');

module.exports = (databaseUrl) => {
    //port
    const port = process.env.PORT || 4000;

    //middleware
    app.use(fileUpload({
        useTempFiles: true
    }));
    app.use(express.json());
    app.use('/api/v1/posts', posts);
    app.use('/api/v1/users', users);
    app.use(errorHandlerMiddleware);

    //cloudinary
    setupCloudConfig();

    //database
    const start = async () => {
        try {
            await connectDB(databaseUrl);
            app.listen(port, console.log(`The server is listening on port ${port}...`));
        }
        catch (error) {
            console.log(error);
        }
    }

    start();
    return app;
}
