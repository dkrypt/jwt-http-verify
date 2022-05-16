const status = require("statuses");
const crypto = require('crypto');
const JwtCacheClient = require('./JwtCacheClient');
const needle = require('needle');
const qs = require('qs');

/**
 * returns an express middleware function for JWT verification
 * @param {VerifierOptions} options options for verifier
 */
const verifier = (options) => {
  const cacheClient = new JwtCacheClient(options.cache);
  /**
   * return true if auth header format is correct.
   * Does not check JWT for any thing except structure
   * @param {String} authHeader header value to check
   * @return {boolean}
   */
  const checkAuthHeader = (authHeader) => {
    if (!authHeader) {
      return false;
    }
    let flag = true;
    const regex = new RegExp('Bearer\\s[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.?[A-Za-z0-9-_.+\\/=]*$', 'gm');
    // console.log(regex.test(authHeader));
    const result = flag && regex.test(authHeader);
    return result;
  };

  /**
   * checks if token is expired
   * @param {String} jwt jwt
   * @return {boolean}
   */
  const isExpired = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const tokenPayload = JSON.parse(jsonPayload);
    const tokenExp = tokenPayload.exp;
    const now = Math.floor(Date.now()/1000);
    return tokenExp < now;
  };

  /**
   * calls the end point to verify jwt
   * @param {VerifierOptions} options options
   * @param {String} jwt jwt
   * @return {Promise<}
   */
  const verifyHttp = async (options, jwt) => {
    const {url, method} = options.http;
    if (method === 'GET') {
      /**@type {needle.NeedleResponse} response */
      const response = await new Promise((resolve, reject) => {
        return needle.request('get', url, {token: jwt}, (err, result) => {
          if (!err && result.statusCode === 200) {
            resolve(result);
          }
          reject(err);
        });
      }).catch((err) => {
        throw err;
      });
      const isValid = options.responseHandler.bind(this, response.body)();
      if (!isValid) {
        return response.body;
      }
      return isValid;
    } else {
      /**@type {needle.NeedleResponse} response */
      const response = await new Promise((resolve, reject) => {
        return needle.request('post', url, qs.stringify({token: jwt}), (err, result) => {
          if (!err && result.statusCode === 200) {
            resolve(result);
          }
          reject(err);
        });
      }).catch((err) => {
        throw err;
      });
      const isValid = options.responseHandler.bind(this, response.body)();
      if (!isValid) {
        return response.body;
      }
      return isValid;
    }
  };

  const verifyJwt = async (jwt) => {
    const tokenHash = crypto.createHash('md5').update(jwt).digest('hex');
    const cachedToken = await cacheClient.get(tokenHash).catch(err => console.log); 
    if (cachedToken) {
      return [undefined, isExpired(cachedToken)]
    } else {
      const tokenResponse = await verifyHttp(options, jwt);
      if (tokenResponse instanceof Error){
        return [tokenResponse, false]
      }
      if (tokenResponse instanceof Boolean) {
        await cacheClient.set(tokenHash, jwt);
        return [undefined, true];
      }
    }
    return [undefined, tokenResponse];
  };
  

  const gerErrorResponseForCode = (code, description) => {
    return {
      code,
      message: status(400),
      description
    };
  };
  /**
   * express middleware for JWT verification
   * @param {ExpressRequest} req request object
   * @param {ExpressResponse} res response object
   * @param {NextFunction} next express next function
   */
  const middlware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const headerValid = checkAuthHeader(authHeader);
    if (!headerValid) {
      return res.status(status('bad request'))
          .json(gerErrorResponseForCode(
            status('bad request'),
            'Invalid authorization header value'  
          ));
    }
    const [err, tokenValid] = await verifyJwt(authHeader.split(' ')[1]);
    if (!err && tokenValid instanceof Boolean) {
      next();
    } else if (err) {
      return res.status(status('unauthorized'))
          .json(gerErrorResponseForCode(
            status('internal server error'),
            `${err.name} :: ${err.message}`
          ));
    } else {
      return res.status(status('unauthorized'))
          .json(gerErrorResponseForCode(
            status('unauthorized'),
            `${err.name} :: ${err.message}`
          ));
    }
  }
  return middlware;
};


module.exports = {
  verifier
};
