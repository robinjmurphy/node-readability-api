var assert = require('assert');
var support = require('./support');

describe('Reader client', function () {
    
  var Reader = require('../lib/reader'),
      reader;

  beforeEach(function () {
    reader = new Reader({
      access_token: 'some_access_key',
      access_token_secret: 'some_access_token'
    });

    support.resetMocks();
  });

  it('can be instantiated with an access token and secret', function () {
    assert.ok(reader);
  });

  it('throws and exception if an access token and key are missing', function () {
    assert.throws(function () {
      var reader = new Reader();
    });
  });

  describe('User', function () {

    it('can get information about the current user', function (done) {
      support.mockWithFile('GET', '/users/_current', 200);

      reader.user(function (err, user) {
        assert.equal(err, null);
        assert.equal(user.username, 'jdoe');
        done();
      });
    });

    it('returns an error when the user is not authenticated', function (done) {
      support.mockWithContent('GET', '/users/_current', 401, 'Failed to authenticate.');
      
      reader.user(function (err, user) {
        assert.equal(user, undefined);
        assert.equal(err.message, 'HTTP 401: Failed to authenticate.');
        done();
      });
    });

    it('returns an error when the an internal server error occurs', function (done) {
      support.mockWithContent('GET', '/users/_current', 500, 'Server error.');
      
      reader.user(function (err, user) {
        assert.equal(user, undefined);
        assert.equal(err.message, 'HTTP 500: Server error.');
        done();
      });
    });

  });

  describe('Bookmarks', function () {

    it('can get all of a user\'s bookmarks', function (done) {
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

    it('can get a single bookmark by ID', function (done) {
      support.mockWithFile('GET', '/bookmarks/75', 200);
      
      reader.bookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });

    it('returns an error when a bookmark cannot be found', function (done) {
      support.mockWithContent('GET', '/bookmarks/12345', 404, 'Not found.');
      
      reader.bookmark('12345', function (err, bookmark) {
        assert.equal(err.message, 'HTTP 404: Not found.');
        assert.equal(bookmark, null);
        done();
      });
    });

    it('can add a new bookmark', function (done) {
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

    it('returns the existing bookmark when adding a duplicate bookmark', function (done) {
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

    it('can archive a bookmark', function (done) {
      support.mockWithFile('POST', '/bookmarks/75', 200);

      reader.archiveBookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });

    it('can unarchive a bookmark', function (done) {
      support.mockWithFile('POST', '/bookmarks/75', 200);

      reader.unarchiveBookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });

    it('can favourite a bookmark', function (done) {
      support.mockWithFile('POST', '/bookmarks/75', 200);

      reader.favouriteBookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });

    it('can unfavourite a bookmark', function (done) {
      support.mockWithFile('POST', '/bookmarks/75', 200);

      reader.unfavouriteBookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });

    it('can favourite using the favorite method', function () {
      assert.equal(reader.favoriteBookmark, reader.favouriteBookmark);
    });

    it('can remove a bookmark', function (done) {
      support.mockWithContent('DELETE', '/bookmarks/75', 204, '');

      reader.removeBookmark('75', function (err, success) {
        assert.equal(err, null);
        assert.ok(success);
        done();
      });
    });

  });

  describe('Tags', function () {

    it('can get all of the tags for the current user', function (done) {
      support.mockWithFile('GET', '/tags', 200);

      reader.userTags(function (err, tags) {
        assert.equal(err, null);
        assert.equal(tags.length, 4);
        done();
      });
    });

    it('can get the tags for a bookmark', function (done) {
      support.mockWithFile('GET', '/bookmarks/75/tags', 200);

      reader.tags('75', function (err, tags) {
        assert.equal(err, null);
        assert.equal(tags.length, 4);
        done();
      });
    });

    it('can add a tag to a bookmark', function (done) {
      support.mockWithFile('POST', '/bookmarks/75/tags', 202);

      reader.addTags('75', ['tag1', 'tag2', 'tag3'],
        function (err, tags) {
          assert.equal(err, null);
          assert.equal(tags.length, 4);
          done();
        });
    });

    it('returns an error if the tag limit is reached', function (done) {
      support.mockWithContent('POST', '/bookmarks/75/tags', 403, 'No more Tags can be added to this Bookmark.');

      reader.addTags('75', ['tag1', 'tag2', 'tag3'],
        function (err, tags) {
          assert.equal(err.message, 'HTTP 403: No more Tags can be added to this Bookmark.');
          assert.equal(tags, undefined);
          done();
        });
    });

    it('can remove a tag from a bookmark', function (done) {
      support.mockWithContent('DELETE', '/bookmarks/75/tags/123', 204, '');
      
      reader.removeTag('75', '123',
        function (err, success) {
          assert.equal(err, null);
          assert.ok(success);
          done();
        });
    });

  });

  describe('Articles', function () {

    it('can get an article by its ID', function (done) {
      support.mockWithFile('GET', '/articles/47g6s8e7', 200);

      reader.article('47g6s8e7', function (err, article) {
        assert.equal(err, null);
        assert.equal(article.id, '47g6s8e7');
        done();
      });
    });

  });

});