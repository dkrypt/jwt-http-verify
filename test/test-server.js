const express = require('express');

const {jwtVerifier} = require('../index');

// express application
const app = express();
// router for this express application instance
const router = express.Router();

// handle all http verbs on '/protected'
router.all('/protected', (req, res, next) => {
  return res.status(200).json({
    message: 'api ok'
  });
});

// app.use(jwtVerifier({
//   http: {
//     url: 'http://localhost:9101/token/introspect',
//     method: 'POST'
//   }
// }))
// app.use('/test', router);

module.exports = {
  router, app
};