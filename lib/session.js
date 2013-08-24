/** @module */

/**
 * An object to hold authentication details
 * @constructor
 * @param {String} access_token
 * @param {String} access_token_secret
 * @alias module:lib/session
 */
var Session = function (access_token, access_token_secret) {
  this.access_token = access_token;
  this.access_token_secret = access_token_secret;
};

module.exports = Session;