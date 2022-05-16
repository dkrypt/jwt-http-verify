const LRUCache = require("lru-cache");

class JwtCacheClient {
  available = false;
  #redisClient;
  #memCacheClient;
  /**
   * @param {CacheOptions} cacheOptions 
   */
  constructor(cacheOptions) {
    /** @type {String} cache type used */
    this.type = cacheOptions.type;
    if (cacheOptions.type === 'redis') {
      /** @type {RedisClientType} redis client */
      this.#redisClient = cacheOptions.redisClient;
    } else {
      /** @type {LRUCache} memory lru cache */
      this.#memCacheClient = new LRUCache({
        ttl: cacheOptions.ttl,
        max: 5000
      });
    }
  }
  /**
   * Set a <K,V> pair in available cache
   * @param {String} key cache entry key
   * @param {String} value cache entry value
   */
  async set(key, value) {
    switch (this.type) {
      case 'redis':
        return await this.redisClient.set(key, value);
      case 'memory':
        return await Promise.resolve(this.#memCacheClient.set(key, value));
    }
  }
  /**
   * Get value for give key
   * @param {String} key cache entry key
   */
     async get(key) {
       console.log('Called');
      switch (this.type) {
        case 'redis':
          return await this.redisClient.get(key);
        case 'memory':
          console.log('Memory');
          return await Promise.resolve(this.#memCacheClient.get(key));
      }
    }
  }

module.exports = JwtCacheClient;
