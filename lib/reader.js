/** @module */
var Session = require('./session');
var config = require('./config');
var request = require('request');
var _ = require('underscore');
var BASE_URL = 'https://www.readability.com/api/rest/v1';

/**
 * A client for the Readability Reader API. Must be instantiated with
 * either an OAuth token/secret pair _or_ an XAuth access token.
 * @constructor
 * @alias module:lib/reader
 * @param {Object} options
 * @param {String} options.access_token - An OAuth access token
 * @param {String} options.access_secret - An OAuth access secret
 */
var Reader = function (options) {
  if (!options.access_token || !options.access_token_secret) {
    throw new Error('Reader clients must be initialized with an OAuth token and token secret');
  }

  this.session = new Session(options.access_token, options.access_token_secret);
};

Reader.prototype.request = function (method, path, options, cb) {
  var conf = config.get(),
      oauth;

  if (!conf) {
    return cb(new Error('The API must be configured with a set of developer keys before it can be used'));
  }

  request(_.extend(options, {
    oauth: {
      consumer_key: conf.consumer_key,
      consumer_secret: conf.consumer_secret,
      token: this.session.access_token,
      token_secret: this.session.access_token_secret
    },
    uri: BASE_URL + path,
    json: true,
    method: method
  }), cb);
};

/**
 * Get information about the current user
 * @param {Function} cb
 * @instance
 */
Reader.prototype.user = function (cb) {
  this.request('GET', '/users/_current', {}, function (err, res, body) {
    cb(err, body);
  });
};

/**
 * Get a single bookmark by its ID
 * @param {String} id
 * @param {Function} cb
 */
Reader.prototype.bookmarks = function (options, cb) {
  this.request('GET', '/bookmarks', {qs: options}, function (err, res, body) {
    delete body.conditions;
    cb(err, body);
  });
};

/**
 * Get a single bookmark by its ID
 * @param {String} id
 * @param {Function} cb
 */
Reader.prototype.bookmark = function (id, cb) {
  this.request('GET', '/bookmarks/' + id, {}, function (err, res, body) {
    cb(err, body);
  });
};

/**
 * Bookmark a URL
 * @param {String} url
 * @param {Function} cb
 */
Reader.prototype.addBookmark = function (url, cb) {
  this.request('POST', '/bookmarks/', {form: {url: url}}, function (err, res, body) {
    cb(err, body);
  });
};

Reader.prototype.updateBookmark = function (id, options, cb) {
  this.request('POST', '/bookmarks/' + id, options, function (err, res, body) {
    cb(err, body);
  });
};

/**
 * Delete a bookmark
 * @param {String} id - A bookmark ID
 * @param {Function} cb
 */
Reader.prototype.removeBookmark = function (id, cb) {
  this.request('DELETE', '/bookmarks/' + id, {}, function (err, res, body) {
    cb(err, body);
  });
};

/**
 * Archive a bookmark
 * @param {String} id
 * @param {Function} cb
 */
Reader.prototype.archiveBookmark = function (id, cb) {
  this.updateBookmark(id, {archive: 1}, cb);
};

/**
 * Unarchive a bookmark
 * @param {String} id
 * @param {Function} cb
 */
Reader.prototype.unarchiveBookmark = function (id, cb) {
  this.updateBookmark(id, {archive: 0}, cb);
};

/**
 * Favourite a bookmark
 * @param {String} id
 * @param {Function} cb
 */
Reader.prototype.favouriteBookmark = function (id, cb) {
  this.updateBookmark(id, {favourite: 1}, cb);
};

/**
 * Unfavourite a bookmark
 * @param {String} id
 * @param {Function} cb
 */
Reader.prototype.unfavouriteBookmark = function (id, cb) {
  this.updateBookmark(id, {favourite: 0}, cb);
};

/**
 * Get all of the tags for the current user
 * @param {Function} cb
 * @instance
 */
Reader.prototype.userTags = function (cb) {
  this.request('GET', '/tags', {}, function (err, res, body) {
    cb(err, body.tags);
  });
};

/**
 * Get the tags for a bookmark
 * @param {String} id - A bookmark ID
 * @param {Function} cb
 */
Reader.prototype.tags = function (id, cb) {
  this.request('GET', '/bookmarks/' + id + '/tags', {}, function (err, res, body) {
    cb(err, body.tags);
  });
};

/**
 * Add an array of tags to a bookmark
 * @param {String} id - A bookmark ID
 * @param {String[]} tags - An array of tags (strings)
 * @param {Function} cb
 */
Reader.prototype.addTags = function (id, tags, cb) {
  var tagsString = tags.join(',');
  this.request('POST', '/bookmarks/' + id + '/tags', 
    {qs: {tags: tagsString}}, function (err, res, body) {
      cb(err, body.tags);
    });
};

/**
 * Get an article by its ID
 * @param {String} id - An article ID
 * @param {Function} cb
 */
Reader.prototype.article = function (id, cb) {
  this.request('GET', '/articles/' + id, {}, function (err, res, body) {
    cb(err, body);
  });
};

// Alias for favorite/favourite
Reader.prototype.favoriteBookmark = Reader.prototype.favouriteBookmark;
Reader.prototype.unfavoriteBookmark = Reader.prototype.unfavouriteBookmark;

module.exports = Reader;