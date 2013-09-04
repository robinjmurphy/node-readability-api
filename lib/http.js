/** @module */
var _ = require('underscore');
var request = require('request');
var errors = require('./errors');

var BASE_URL = 'https://www.readability.com/api';
var ERROR_CODES = [400, 401, 403, 404, 500, 504];

exports = module.exports = {};

function handleHttpResponse(err, res, body, cb) {
  if (err) return cb(err);

  if (ERROR_CODES.indexOf(res.statusCode) !== -1) {
    var message = body;

    if (body.messages) message = JSON.stringify(body.messages);

    return cb(errors.http(res.statusCode, message));
  }

  return cb(err, res, body);
}

/**
 * Make a HTTP request with automatic JSON parsing 
 * @param {String} method - A HTTP verb e.g GET, POST
 * @param {String} path - A Readability API path (the part that follows https://www.readability.com/api)
 * @param {Object} options - any options supported by the [Request API](https://github.com/mikeal/request#requestoptions-callback)
 * @param {Function} cb
 */
exports.request = function (method, path, options, cb) {
  request(_.extend(options, {
    uri: BASE_URL + path,
    json: true,
    method: method
  }), function (err, res, body) {
    handleHttpResponse(err, res, body, cb);
  });
}