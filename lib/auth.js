/** @module */
var request = require('request');
var config = require('./config');
var qs = require('querystring');
var errors = require('./errors');
var X_AUTH_ENDPOINT = 'https://www.readability.com/api/rest/v1/oauth/access_token/';

function handleHttpResponse(err, res, body, cb) {
  if (res.statusCode !== 200) {
    return cb(errors.http(res.statusCode, body));
  } else {
    var tokens = qs.parse(body);

    delete tokens.oauth_callback_confirmed;

    return cb(null, tokens);
  }
}

/**
 * Authenticate a user with Readability's XAuth endpoint
 * @param {String} username
 * @param {String} password
 * @param {Function} cb
 */
module.exports.xauth = function (username, password, cb) {
  var conf = config.get();

  if (!config.containsReaderCredentials()) {
    return cb(errors.readerConsumerKeys());
  }

  request.get({
    oauth: {
      consumer_key: conf.consumer_key,
      consumer_secret: conf.consumer_secret
    },
    qs: {
      x_auth_username: username,
      x_auth_password: password,
      x_auth_mode: 'client_auth'
    },
    uri: X_AUTH_ENDPOINT
  }, function (err, res, body) {
    handleHttpResponse(err, res, body, cb);
  });
};