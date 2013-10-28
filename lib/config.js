/** @module */
var config = {};

exports = module.exports = {};

/**
 * Set the developer API details
 * @param {Object} options
 * @param {String} options.consumer_key - A Readability consumer key
 * @param {String} options.consumer_secret - A Readability consumer secret
 * @param {String} options.parser_token - A Readability parser token
 */
exports.set = function (options) {
  config.consumer_key = options.consumer_key;
  config.consumer_secret = options.consumer_secret;
  config.parser_token = options.parser_token;
};

/** 
 * Get the initial configuration
 * @returns {Object}
 **/
exports.get = function () {
  return config;
};

/**
 * Validate the presence of an OAuth consumer key and secret
 * @returns {Boolean}
 */
exports.containsReaderCredentials = function () {
  return config.consumer_key &&
          config.consumer_key !== '' &&
          config.consumer_secret &&
          config.consumer_key !== '';
};

/**
 * Validate the presence of a parser token
 * @returns {Boolean}
 */
exports.containsParserToken = function () {
  return config.parser_token && config.parser_token !== '';
};