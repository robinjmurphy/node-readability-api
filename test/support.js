var nock = require('nock');
var BASE_URL = 'https://www.readability.com/api/rest/v1';

function intercept(method, api_path) {
  var scope = nock(BASE_URL)
      .filteringPath(function (path) {
        if (path.match(new RegExp(api_path + '$'))) {
          return api_path;
        }
      })
      .intercept(api_path, method);

  return scope;
}

module.exports.mockWithFile = function (method, api_path, statusCode) {
  intercept(method, api_path).replyWithFile(statusCode, __dirname + '/fixtures' + api_path + '.json');
};

module.exports.mockWithHeaders = function (method, api_path, statusCode, headers) {
  intercept(method, api_path).reply(statusCode, '', headers);
};

module.exports.mockWithContent = function (method, api_path, statusCode, content) {
  intercept(method, api_path).reply(statusCode, content);
};

module.exports.resetMocks = function () {
  nock.cleanAll();
};

module.exports.initializeMocking = function () {
  this.mockWithFile('GET', '/users/_current', 200);
  this.mockWithFile('GET', '/bookmarks/75', 200);
  this.mockWithFile('POST', '/bookmarks/75', 200);
  this.mockWithFile('GET', '/tags', 200);
  this.mockWithFile('GET', '/bookmarks/75/tags', 200);
  this.mockWithFile('POST', '/bookmarks/75/tags', 200);
  this.mockWithFile('GET', '/articles/47g6s8e7', 200);
  this.mockWithContent('DELETE', '/bookmarks/75/tags/123', 204, '');
  this.mockWithContent('DELETE', '/bookmarks/75', 204, '');
  this.mockWithFile('GET', '/bookmarks', 200);
  this.mockWithHeaders('POST', '/bookmarks', 202, {Location: BASE_URL + '/bookmarks/75'});
};