const { createClient } = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.redisClient = createClient();
    this.redisClient.on('error', (err) => {
      console.log(`Redis client not connected to server: ${err.message}`);
    });
  }

  isAlive() {
    return this.redisClient.connected;
  }

  async get(key) {
    this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
    const val = await this.getAsync(key);
    return val;
  }

  async set(key, value, duration) {
    this.setAsync = promisify(this.redisClient.set).bind(this.redisClient);
    await this.setAsync(key, value, 'EX', duration);
  }

  async del(key) {
    this.delAsync = promisify(this.redisClient.del).bind(this.redisClient);
    await this.delAsync(key);
  }
}

module.exports = new RedisClient();
