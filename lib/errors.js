module.exports.http = function (code, message) {
  return new Error('HTTP ' + code + ': ' + message);
};

module.exports.readerConsumerKeys = function () {
  return new Error('The Readability API must be configured with a developer key and secret before it can be used');
};

module.exports.parserTokenMissing = function () {
  return new Error('The Readability API must be configured with a parser token before it can be used');
}