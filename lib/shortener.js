/** @module */
var http = require('./http');
var BASE_PATH = '/shortener/v1';

/**
 * A client for the Readability Parser API
 * @constructor
 * @alias module:lib/shortener
 */
var Shortener = function () {};

/**
 * Shorten a URL
 * @param {String} url
 * @param {Function} cb
 */
Shortener.prototype.shorten = function (url, cb) {
  http.request('POST', BASE_PATH + '/urls', {form: {url: url}}, function (err, res, body) {
    if (err) return cb(err, null, null);

    var shortUrl = undefined;

    if (body && body.meta) {
      shortUrl = body.meta.rdd_url;
    }

    cb(null, shortUrl, body);
  });
};

/**
 * Get information about a short URL
 * @param {String} id
 * @param {Function} cb
 */
Shortener.prototype.url = function (id, cb) {
  http.request('GET', BASE_PATH + '/urls/' + id, {}, function (err, res, body) {
    if (err) return cb(err, null);

    cb(null, body.meta);
  });
}

module.exports = Shortener;