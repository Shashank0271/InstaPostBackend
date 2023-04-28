const redis = require("redis");
const client = redis.createClient();

async function connect() {
  await client.connect().then(()=>console.log("REDIS CLIENT CONNECTED"))
}

connect();
// module.exports.redisClient = client;
module.exports = connect;
