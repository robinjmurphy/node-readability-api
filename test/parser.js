var Parser = require('../lib/parser');
var support = require('./support');
var assert = require('assert');
var config = require('../lib/config');

describe('parser', function () {

  var parser;

  beforeEach(function () {
    parser = new Parser();
    support.configureClient();
    support.resetMocks();
  });

  describe('.parse()', function () {
    it('should return a parsed article', function (done) {
      support.mockWithFile('GET', '/content/v1/parser', 200);

      parser.parse('http://some.url/article.html', function (err, parsed) {
        assert.equal(err, null);
        assert.equal(parsed.author, "Rafi Kohan");
        assert.equal(parsed.content, "<div class=\"article-text\">\n<p>I'm idling outside Diamante's, [snip] ...</p></div>");
        done();
      });
    });

    describe('when a parser token hasn\'t been configured', function () {
      it('should return an error', function (done) {
        config.set({});

        parser.parse('http://some.url/article.html', function (err, parsed) {
          assert.equal(err.message, 'The Readability API must be configured with a parser token before it can be used');
          assert.equal(parsed, null);
          done();
        });
      });
    });

    describe('when the page contents cannot be parsed', function () {
      it('should return an error', function (done) {
        support.mockWithContent('GET', '/content/v1/parser', 400, 'Could not parse the content for this article.');

        parser.parse('http://some.url/article_which_cannot_be_parsed.html', function (err, parsed) {
          assert.equal(err.message, 'HTTP 400: Could not parse the content for this article.');
          assert.equal(parsed, null);
          done();
        });
      });
    });
  });

  describe('.confidence()', function () {
    it('should return a confidence value', function (done) {
      support.mockWithFile('GET', '/content/v1/confidence', 200);

      parser.confidence('http://some.url/article.html', function (err, confidence) {
        assert.equal(err, null);
        assert.equal(confidence, 0.7);
        done();
      });
    });
  });

});
