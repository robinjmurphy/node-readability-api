var nock = require('nock');
var BASE_URL = 'https://www.readability.com/api/rest/v1';

module.exports.mockReaderAPIResponse = function (method, api_path, fixture, statusCode) {
  nock(BASE_URL)
      .filteringPath(function (path) {
        if (path.match(new RegExp(api_path))) {
          return api_path;
        }
      })
      .intercept(api_path, method)
      .replyWithFile(statusCode, __dirname + '/fixtures' + fixture + '.json');
};

module.exports.initializeMocking = function () {
  this.mockReaderAPIResponse('GET', '/users/_current', '/users/_current', 200);
  this.mockReaderAPIResponse('GET', '/bookmarks', '/bookmarks', 200);
  this.mockReaderAPIResponse('GET', '/bookmarks/75', '/bookmarks/75', 200);
  this.mockReaderAPIResponse('POST', '/bookmarks', '/bookmarks/75', 200);
  this.mockReaderAPIResponse('POST', '/bookmarks/75', '/bookmarks/75', 200);
  this.mockReaderAPIResponse('GET', '/tags', '/tags', 200);
  this.mockReaderAPIResponse('GET', '/bookmarks/75/tags', '/bookmarks/75/tags', 200);
  this.mockReaderAPIResponse('POST', '/bookmarks/75/tags', '/bookmarks/75/tags', 200);
  this.mockReaderAPIResponse('GET', '/articles/47g6s8e7', '/articles/47g6s8e7', 200);
};