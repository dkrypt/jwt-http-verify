// ====================================================================
// Wrapper types for library modules
// ====================================================================
/**
 * @typedef {import("@redis/client").RedisClientType} RedisClientType
 * @typedef {import('express').Request} ExpressRequest 
 * @typedef {import('express').Response} ExpressResponse
 * @typedef {import('express').NextFunction} NextFunction  
 * @typedef {JwtCacheClient} JwtCacheClient
 * @typedef {import("needle").BodyData} ResponseBody
 */


// ====================================================================
// Custom object types
// ====================================================================

/**
 * @typedef {(x: ResponseBody) => boolean} responseHandler
 */
/**
 * @typedef {Object} CacheOptions
 * @property {number} ttl cache ttl, milliseconds
 * @property {('redis'|'memory')} type cache type
 * @property {RedisClientType} redisClient redis client if cache.type is "redis"
 */

/**
 * @typedef {Object} VerifierOptions
 * @property {Object} http http endpoint options
 * @property {('GET'|'POST')} [http.method] http method to use
 * @property {String} http.url http(s) URL to use
 * @property {CacheOptions} cache cache options
 * @property {responseHandler} responseHandler
 */