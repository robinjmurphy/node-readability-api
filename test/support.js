var nock = require('nock');
var BASE_URL = 'https://www.readability.com/api/rest/v1';

function scopeAPIRequests(method, api_path) {
  var scope = nock(BASE_URL)
      .filteringPath(function (path) {
        if (path.match(new RegExp(api_path + '$'))) {
          return api_path;
        }
      })
      .intercept(api_path, method);

  return scope;
}

module.exports.mockReaderAPIResponseWithFile = function (method, api_path, fixture, statusCode) {
  scopeAPIRequests(method, api_path).replyWithFile(statusCode, __dirname + '/fixtures' + fixture + '.json');
};

module.exports.mockReaderAPIResponseWithHeaders = function (method, api_path, headers, statusCode) {
  scopeAPIRequests(method, api_path).reply(statusCode, '', headers);
};



module.exports.initializeMocking = function () {
  this.mockReaderAPIResponseWithFile('GET', '/users/_current', '/users/_current', 200);
  this.mockReaderAPIResponseWithFile('GET', '/bookmarks/75', '/bookmarks/75', 200);
  this.mockReaderAPIResponseWithFile('POST', '/bookmarks/75', '/bookmarks/75', 200);
  this.mockReaderAPIResponseWithFile('GET', '/tags', '/tags', 200);
  this.mockReaderAPIResponseWithFile('GET', '/bookmarks/75/tags', '/bookmarks/75/tags', 200);
  this.mockReaderAPIResponseWithFile('POST', '/bookmarks/75/tags', '/bookmarks/75/tags', 200);
  this.mockReaderAPIResponseWithFile('GET', '/articles/47g6s8e7', '/articles/47g6s8e7', 200);
  this.mockReaderAPIResponseWithFile('DELETE', '/bookmarks/75/tags/123', '/empty', 204);
  this.mockReaderAPIResponseWithFile('DELETE', '/bookmarks/75', '/empty', 204);
  this.mockReaderAPIResponseWithFile('GET', '/bookmarks', '/bookmarks', 200);
  this.mockReaderAPIResponseWithHeaders('POST', '/bookmarks', {Location: BASE_URL + '/bookmarks/75'}, 202);
};