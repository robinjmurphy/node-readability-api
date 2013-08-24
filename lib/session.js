/** @module */

/**
 * An object to hold authentication details
 * @constructor
 * @param {string} access_token
 * @param {string} access_token_secret
 * @alias module:lib/session
 */
var Session = function (access_token, access_token_secret) {
  this.access_token = access_token;
  this.access_token_secret = access_token_secret;
};

module.exports = Session;