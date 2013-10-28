/** @module */
var http = require('./http');
var config = require('./config');
var qs = require('querystring');
var errors = require('./errors');
var X_AUTH_PATH = '/rest/v1/oauth/access_token/';

exports = module.exports = {};

function handleHttpResponse(err, res, body, cb) {
  var tokens;

  if (err) return cb(err);

  tokens = qs.parse(body);
  delete tokens.oauth_callback_confirmed;

  return cb(null, tokens);
}

/**
 * Authenticate a user with Readability's XAuth endpoint
 * @param {String} username
 * @param {String} password
 * @param {Function} cb
 */
exports.xauth = function (username, password, cb) {
  var conf = config.get(),
      httpOptions;

  if (!config.containsReaderCredentials()) {
    return cb(errors.readerConsumerKeys());
  }

  httpOptions = {
    oauth: {
      consumer_key: conf.consumer_key,
      consumer_secret: conf.consumer_secret
    },
    qs: {
      x_auth_username: username,
      x_auth_password: password,
      x_auth_mode: 'client_auth'
    }
  };

  http.request('GET', X_AUTH_PATH, httpOptions, function (err, res, body) {
    handleHttpResponse(err, res, body, cb);
  });
};