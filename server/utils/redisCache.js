const redis = require("redis");

let client;

if (process.env.REDIS_URL) {
  client = redis.createClient({
    url: process.env.REDIS_URL
  });
  
  client.on('error', (err) => console.log('Redis Client Error', err));
  
  client.connect().then(() => {
    console.log("Connected to Redis");
  }).catch(console.error);
} else {
  console.log("Redis URL not provided, caching disabled.");
}

const getCache = async (key) => {
  if (!client) return null;
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

const setCache = async (key, data, exp = 3600) => {
  if (!client) return;
  await client.setEx(key, exp, JSON.stringify(data));
};

module.exports = { getCache, setCache };
