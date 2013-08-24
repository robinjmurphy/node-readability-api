var config = {};

/**
 * Set up the clients with developer API details
 * @alias module:readability-api.configure
 * @param {Object} options
 * @param {string} options.consumer_key - A Readability consumer key
 * @param {string} options.consumer_secret - A Readability consumer secret
 * @param {string} options.parser_token - A Readability parser token
 */
module.exports.set = function (options) {
  config.consumer_key = options.consumer_key;
  config.consumer_secret = options.consumer_secret;
  config.parser_token = options.parser_token;
};

module.exports.get = function () {
  return config;
};