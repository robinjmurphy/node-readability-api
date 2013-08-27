var reader = require('./lib/reader');
var config = require('./lib/config');
var auth = require('./lib/auth');

module.exports.reader = reader;
module.exports.configure = config.set;
module.exports.xauth = auth.xauth;