const redis = require("redis");
const client = redis.createClient({
  host: 'redis',
  port: process.env.REDIS_PORT,
  url: 'redis://redis:6379',
});

async function connect() {
  try {
    await client.connect().then(() => console.log("REDIS CLIENT CONNECTED"))

  } catch (e) {
    console.log(e.toString());
  }
}

connect();
module.exports = client;