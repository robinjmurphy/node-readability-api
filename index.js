var reader = require('./lib/reader');
var config = require('./lib/config');

module.exports.reader = reader;
module.exports.configure = config.set;