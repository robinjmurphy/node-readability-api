var Shortener = require('../lib/shortener');
var support = require('./support');
var assert = require('assert');

describe('shortener', function () {

  var shortener;

  beforeEach(function () {
    shortener = new Shortener();
    support.configureClient();
    support.resetMocks();
  });

  describe('.shorten()', function () {
    it('should return a short URL', function (done) {
      support.mockWithFile('POST', '/shortener/v1/urls', 202);

      shortener.shorten('http://www.example.com/article.html', function (err, shortUrl) {
        assert.equal(err, null);
        assert.equal(shortUrl, "http://rdd.me/y6twed6d");
        done();
      });
    });

    describe('when a the Shortener API returns a 500 error', function () {
      it('should return an error', function (done) {
        support.mockWithContent('POST', '/shortener/v1/urls', 500, 'There was a problem.');

        shortener.shorten('http://www.example.com/article.html', function (err, shortUrl) {
          assert.equal(err.message, 'HTTP 500: There was a problem.');
          assert.equal(shortUrl, null);
          done();
        });
      });
    });
  });
});