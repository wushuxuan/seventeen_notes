var jwt = require('jsonwebtoken');
var config = require('../config');

function verifyToken (req, res, next) {
  const token = req.headers['x-access-token'];
  // if (req.url.includes('login') || req.url.includes('register') || (!req.url.includes('comment') && req.method !== 'GET')) {
  if (req.url.includes('login') || req.url.includes('register') || req.method !== 'GET') {
      return next();
  }
  if (!token) {
      return res.status(401).send({ errorCode: 401, message: 'No token provided.' });
  }
  jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
          return res.status(401).send({ errorCode: 401, message: 'Failed to authenticate token.' });
      }
      req.email = decoded.email;
      next();
  }); 
}

module.exports = verifyToken;