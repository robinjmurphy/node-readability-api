var reader = require('./lib/reader');
var config = require('./lib/config');
var auth = require('./lib/auth');
var parser = require('./lib/parser');
var shortener = require('./lib/shortener');

module.exports.reader = reader;
module.exports.configure = config.set;
module.exports.xauth = auth.xauth;
module.exports.parser = parser;
module.exports.shortener = shortener;