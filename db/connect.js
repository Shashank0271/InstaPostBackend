const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
module.exports.connectDB = async (url) => {
    await mongoose.connect(url).then(() => console.log("CONNECTED TO DATABASE"));
};
module.exports.disconnectDB = async () => {
    await mongoose.disconnect().then(() => console.log("DISCONNECTED DATABASE"));
    await mongoose.connection.close();
}




