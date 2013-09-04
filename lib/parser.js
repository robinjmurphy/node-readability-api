/** @module */
var http = require('./http');
var _ = require('underscore');
var config = require('./config');
var BASE_PATH = '/content/v1';
var errors = require('./errors');

/**
 * A client for the Readability Parser API
 * @constructor
  @alias module:lib/parser
 */
var Parser = function () {};

Parser.prototype.request = function (method, path, options, cb) {
  var conf = config.get(),
      httpOptions = {};

  if (!config.containsParserToken()) {
    return cb(errors.parserTokenMissing());
  }

  httpOptions.qs = _.extend(options, {token: conf.parser_token});

  http.request('GET', BASE_PATH + path, httpOptions, cb);
};

/**
 * Parse a URL
 * @param {String} url
 * @param {Function} cb
 */
Parser.prototype.parse = function (url, cb) {
  this.request('GET', '/parser', {url: url}, function (err, res, body) {
    cb(err, body);
  });
};

/**
 * Get the parser confidence score for a URL
 * @param {String} url
 * @param {Function} cb
 */
Parser.prototype.confidence = function (url, cb) {
  this.request('GET', '/confidence', {url: url}, function (err, res, body) {
    var confidence = body ? body.confidence : null;
    
    cb(err, confidence);
  }); 
}

module.exports = Parser;