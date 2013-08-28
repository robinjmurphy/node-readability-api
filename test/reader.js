var assert = require('assert');
var support = require('./support');
var config = require('../lib/config');

describe('reader', function () {
    
  var Reader = require('../lib/reader'),
      reader;

  beforeEach(function () {
    support.configureClient();
    support.resetMocks();
    
    reader = new Reader({
      access_token: 'some_access_key',
      access_token_secret: 'some_access_token'
    });
  });

  describe('when instantiated without an access token and secret', function () {
    it('should throw an exception', function () {
      assert.throws(function () {
        var reader = new Reader();
      });
    });
  });

  describe('.getUser()', function () {

    it('should return information about the current user', function (done) {
      support.mockWithFile('GET', '/users/_current', 200);

      reader.user(function (err, user) {
        assert.equal(err, null);
        assert.equal(user.username, 'jdoe');
        done();
      });
    });

    describe('when a user is not authenticated', function () {
      it('should return an error', function (done) {
        support.mockWithContent('GET', '/users/_current', 401, 'Failed to authenticate.');
        
        reader.user(function (err, user) {
          assert.equal(user, undefined);
          assert.equal(err.message, 'HTTP 401: Failed to authenticate.');
          done();
        });
      });
    });

    describe('when an internal server error occurs', function () {
      it('should return an error', function (done) {
        support.mockWithContent('GET', '/users/_current', 500, 'Server error.');
        
        reader.user(function (err, user) {
          assert.equal(user, undefined);
          assert.equal(err.message, 'HTTP 500: Server error.');
          done();
        });
      });
    });

    describe('when a set of developer keys hasn\'t been configured', function () {
      it('should return an error', function (done) {
        config.set({});

        reader.user(function (err, user) {
          assert.equal(err.message, 'The Readability API must be configured with a developer key and secret before it can be used');
          assert.equal(user, null);
          done();
        });
      });
    });

  });

  describe('.bookmarks()', function () {
    it('should return all of a user\'s bookmarks', function (done) {
      support.mockWithFile('GET', '/bookmarks', 200);
      
      reader.bookmarks({}, function (err, bookmarks) {
        assert.equal(err, null);
        assert.ok(bookmarks.meta);
        assert.ok(bookmarks.bookmarks);
        assert.equal(bookmarks.meta.item_count_total, 76);
        assert.equal(bookmarks.bookmarks.length, 2);
        done();
      });
    });
  });

  describe('.bookmark()', function () {
    it('should return a single bookmark', function (done) {
      support.mockWithFile('GET', '/bookmarks/75', 200);
      
      reader.bookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });

    describe('when the bookmark cannot be found', function () {
      it('should return an error', function (done) {
        support.mockWithContent('GET', '/bookmarks/12345', 404, 'Not found.');
        
        reader.bookmark('12345', function (err, bookmark) {
          assert.equal(err.message, 'HTTP 404: Not found.');
          assert.equal(bookmark, null);
          done();
        });
      });
    });
  });

  describe('.addBookmark()', function () {
    it('should return the newly created bookmark', function (done) {
      support.mockWithHeaders('POST', '/bookmarks', 202,
        {Location: 'https://www.readability.com/api/rest/v1/bookmarks/75'});
      support.mockWithFile('GET', '/bookmarks/75', 200);

      reader.addBookmark(
        'http://some.url.com/article.html', function (err, bookmark) {
          assert.equal(err, null);
          assert.equal(bookmark.id, '75');
          done();
        });
    });

    describe('when a duplicate bookmark already exists', function () {
      it('should return the existing bookmark', function (done) {
        support.mockWithHeaders('POST', '/bookmarks', 409,
          {Location: 'https://www.readability.com/api/rest/v1/bookmarks/75'});
        support.mockWithFile('GET', '/bookmarks/75', 200);

        reader.addBookmark(
          'http://some.url.com/article.html', function (err, bookmark) {
            assert.equal(err, null);
            assert.equal(bookmark.id, '75');
            done();
          });
      });
    });
  });

  describe('.archiveBookmark()', function () {
    it('should return the archived bookmark', function (done) {
      support.mockWithFile('POST', '/bookmarks/75', 200);

      reader.archiveBookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });
  });

  describe('.unacrhiveBookmark()', function () {
    it('should return the unarchived bookmark', function (done) {
      support.mockWithFile('POST', '/bookmarks/75', 200);

      reader.unarchiveBookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });
  });

  describe('.favouriteBookmark()', function () {
    it('should return the favourited bookmark', function (done) {
      support.mockWithFile('POST', '/bookmarks/75', 200);

      reader.favouriteBookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });
  });

  describe('.unfavouriteBookmark()', function () {
    it('can should return the unfavourited bookmark', function (done) {
      support.mockWithFile('POST', '/bookmarks/75', 200);

      reader.unfavouriteBookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });
  });

  describe('.favoriteBookmark()', function () {
    it('should be an alias for .favouriteBookmark()', function () {
      assert.equal(reader.favoriteBookmark, reader.favouriteBookmark);
    });
  });

  describe('.unfavoriteBookmark()', function () {
    it('should be an alias for .unfavouriteBookmark()', function () {
      assert.equal(reader.unfavoriteBookmark, reader.unfavouriteBookmark);
    });
  });

  describe('.removeBookmark()', function () {
    it('should return a true success boolean', function (done) {
      support.mockWithContent('DELETE', '/bookmarks/75', 204, '');

      reader.removeBookmark('75', function (err, success) {
        assert.equal(err, null);
        assert.ok(success);
        done();
      });
    });
  });

  describe('.userTags()', function () {
    it('should return all of the tags for the current user', function (done) {
      support.mockWithFile('GET', '/tags', 200);

      reader.userTags(function (err, tags) {
        assert.equal(err, null);
        assert.equal(tags.length, 4);
        done();
      });
    });
  });

  describe('.tags()', function () {
    it('should return the tags for a bookmark', function (done) {
      support.mockWithFile('GET', '/bookmarks/75/tags', 200);

      reader.tags('75', function (err, tags) {
        assert.equal(err, null);
        assert.equal(tags.length, 4);
        done();
      });
    });
  });

  describe('.addTags()', function () {
    it('should return a list of tags for the bookmark', function (done) {
      support.mockWithFile('POST', '/bookmarks/75/tags', 202);

      reader.addTags('75', ['tag1', 'tag2', 'tag3'],
        function (err, tags) {
          assert.equal(err, null);
          assert.equal(tags.length, 4);
          done();
        });
    });

    describe('when the tag limit has been reached', function () {
      it('should return an error', function (done) {
        support.mockWithContent('POST', '/bookmarks/75/tags', 403, 'No more Tags can be added to this Bookmark.');

        reader.addTags('75', ['tag1', 'tag2', 'tag3'],
          function (err, tags) {
            assert.equal(err.message, 'HTTP 403: No more Tags can be added to this Bookmark.');
            assert.equal(tags, undefined);
            done();
          });
      });
    });
  });

  describe('.removeTag()', function () {
    it('should return a true success boolean', function (done) {
      support.mockWithContent('DELETE', '/bookmarks/75/tags/123', 204, '');
      
      reader.removeTag('75', '123',
        function (err, success) {
          assert.equal(err, null);
          assert.ok(success);
          done();
        });
    });
  });

  describe('.article()', function () {
    it('should return a single article', function (done) {
      support.mockWithFile('GET', '/articles/47g6s8e7', 200);

      reader.article('47g6s8e7', function (err, article) {
        assert.equal(err, null);
        assert.equal(article.id, '47g6s8e7');
        done();
      });
    });
  });
});