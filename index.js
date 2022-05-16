#!/usr/bin/env node

const {JWTVerifierConfigError} = require('./src/errors');
const {verifier} = require('./src/verifier');
const {isValidHttpUrl} = require('./src/utils');


/**
 * returns the default options
 * @return {VerifierOptions}
 */
const defaultOptions = (url) => {
  return {
    http: {
      method: 'POST',
      url
    },
    cache: {
      ttl: 7200000,
      type: 'memory'
    },
    responseHandler: (body) => {
      console.log('body', body);
      return body.valid === true;
    }
  }
};

const mergeDefaults = (options) => {
  return { ...options, ...defaultOptions(options.http.url)};
};

/**
 * returns an express middleware for verifying jwts
 * using HTTP endpoint
 * @param {(VerifierOptions|String)} options verifier options
 */
const jwtVerifier = (options) => {
  // If no options provided
  if (!options) {
    throw new JWTVerifierConfigError('No options provided');
  }
  // If argument passed is a string
  if (typeof options === 'string' || options instanceof String) {
    if (!isValidHttpUrl(options)) {
      const err = new JWTVerifierConfigError('Invalid URL format provided');
    }
    return verifier(defaultOptions(options));
  } else if (typeof options === 'object') {
    options = mergeDefaults(options);
    // options.http.method defaults to 'POST'
    options.http.method = options.http.method || 'POST';
    // If no HTTP url is provied
    if (!options.http.url) {
      throw new JWTVerifierConfigError('http.url is a required options');
    }
    options.cache.type = options.cache?.type || 'memory';
    if (options.cache.type === 'redis' && !options.cache.redisClient) {
      throw new JWTVerifierConfigError('redis client must be provided if cache.type is "redis"');
    }
    return verifier(options);
  }
};

// jwtVerifier({http: {}});
module.exports.jwtVerifier = jwtVerifier;
