/** @module */
var Session = require('./session');
var config = require('./config');
var errors = require('./errors');
var http = require('./http');
var BASE_PATH = '/rest/v1';
var _ = require('lodash');

function validateOptions(options) {
  return options && options.access_token && options.access_token_secret;
}

/**
 * A client for the Readability Reader API. Must be instantiated with
 * either an OAuth token/secret pair.
 * @constructor
 * @alias module:lib/reader
 * @param {Object} options
 * @param {String} options.access_token - An OAuth access token
 * @param {String} options.access_secret - An OAuth access secret
 */
var Reader = function (options) {
  if (!validateOptions(options)) {
    throw new Error('Reader clients must be initialized with an OAuth token and token secret');
  }

  this.session = new Session(options.access_token, options.access_token_secret);
};

Reader.prototype.request = function (method, path, options, cb) {
  var conf = config.get(),
      oauth,
      httpOptions;

  if (!config.containsReaderCredentials()) {
    return cb(errors.readerConsumerKeys());
  }

  oauth = {
    consumer_key: conf.consumer_key,
    consumer_secret: conf.consumer_secret,
    token: this.session.access_token,
    token_secret: this.session.access_token_secret
  };

  httpOptions = _.extend(options, {oauth: oauth});

  http.request(method, BASE_PATH + path, httpOptions, cb);
};

/**
 * Get information about the current user
 * @param {Function} cb
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
  var that = this;

  this.request('POST', '/bookmarks', {form: {url: url}}, function (err, res, body) {
    if (err) return cb(err);

    var id = res.headers.location.match(/bookmarks\/(\d*)$/)[1];
    that.bookmark(id, cb);
  });
};

Reader.prototype.updateBookmark = function (id, options, cb) {
  this.request('POST', '/bookmarks/' + id, {form: options}, function (err, res, body) {
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
    if (err) return cb(err);
    cb(null, true);
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
  this.updateBookmark(id, {favorite: 1}, cb);
};

/**
 * Unfavourite a bookmark
 * @param {String} id
 * @param {Function} cb
 */
Reader.prototype.unfavouriteBookmark = function (id, cb) {
  this.updateBookmark(id, {favorite: 0}, cb);
};

/**
 * Get all of the tags for the current user
 * @param {Function} cb
 */
Reader.prototype.userTags = function (cb) {
  this.request('GET', '/tags', {}, function (err, res, body) {
    var tags = body ? body.tags : null;

    cb(err, tags);
  });
};

/**
 * Get the tags for a bookmark
 * @param {String} id - A bookmark ID
 * @param {Function} cb
 */
Reader.prototype.tags = function (id, cb) {
  this.request('GET', '/bookmarks/' + id + '/tags', {}, function (err, res, body) {
    var tags = body ? body.tags : null;

    cb(err, tags);
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
    {form: {tags: tagsString}}, function (err, res, body) {
      var tags = body ? body.tags : null;

      cb(err, tags);
    });
};

/**
 * Remove a tag from a bookmark
 * @param {String} bookmarkId - A bookmark ID
 * @param {String} tagId - A tag ID
 * @param {Function} cb
 */
Reader.prototype.removeTag = function (bookmarkId, tagId, cb) {
  this.request('DELETE', '/bookmarks/' + bookmarkId + '/tags/' + tagId,
    {}, function (err, res, body) {
      if (err) return cb(err);
      cb(null, true);
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
