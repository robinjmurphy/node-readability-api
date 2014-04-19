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

      shortener.shorten('http://www.example.com/article.html', function (err, shortUrl, data) {
        assert.equal(err, null);
        assert.equal(shortUrl, "http://rdd.me/y6twed6d");
        assert.equal(data.id, 'y6twed6d');
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

  describe('.url()', function () {
    it('returns information about a short URL', function (done) {
      support.mockWithFile('GET', '/shortener/v1/urls/y6twed6d', 200);

      shortener.url('y6twed6d', function (err, url) {
        assert.equal(err, null);
        assert.equal(url.rdd_url, 'http://rdd.me/y6twed6d');
        done();
      });
    });

    describe('when the Shortener API returns an error', function () {
      it('returns an error', function (done) {
        support.mockWithFile('GET', '/shortener/v1/urls/some_id', 500);

        shortener.url('some_id', function (err, url) {
          assert.equal(err.message, "HTTP 500: Readability encountered a server error. We should have been made aware of this issue automatically. If this continues, please contact us at contact@readability.com and let us know under what conditions you're receiving this error.")
          done();
        });
      });
    });
  });
});