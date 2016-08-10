var nock = require('nock');
var BASE_URL = 'https://www.readability.com/api';
var readability = require('..');

function intercept(api_path, method) {
  var scope = nock(BASE_URL)
      .filteringPath(/\?.*/, '')
      .intercept(api_path, method);

  return scope;
}

module.exports.mockWithFile = function (method, api_path, statusCode) {
  intercept(api_path, method).replyWithFile(statusCode, __dirname + '/fixtures' + api_path + '.json');
};

module.exports.mockWithHeaders = function (method, api_path, statusCode, headers) {
  intercept(api_path, method).reply(statusCode, '', headers);
};

module.exports.mockWithContent = function (method, api_path, statusCode, content) {
  intercept(api_path, method).reply(statusCode, content);
};

module.exports.resetMocks = function () {
  nock.disableNetConnect();
  nock.cleanAll();
};

module.exports.configureClient = function () {
  readability.configure({
    consumer_key: 'some_consumer_key',
    consumer_secret: 'some_consumer_secret',
    parser_token: 'some_parser_token'
  });
};
