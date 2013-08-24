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

    support.initializeMocking();
  });

  it('can be instantiated with an access token and secret', function () {
    assert.ok(reader);
  });

  it('throws and excepition if an access token and key are missing', function () {
    assert.throws(function () {
      var reader = new Reader();
    });
  });

  describe('User', function () {

    it('can get information about the current user', function (done) {
      var user = reader.user(function (err, user) {
        assert.equal(err, null);
        assert.equal(user.username, 'jdoe');
        done();
      });
    });

  });

  describe('Bookmarks', function () {

    it('can get all of a user\'s bookmarks', function (done) {
      var bookmarks = reader.bookmarks({}, function (err, bookmarks) {
        assert.equal(err, null);
        assert.ok(bookmarks.meta);
        assert.ok(bookmarks.bookmarks);
        assert.equal(bookmarks.meta.item_count_total, 76);
        assert.equal(bookmarks.bookmarks.length, 2);
        done();
      });
    });

    it('can get a single bookmark by ID', function (done) {
      var bookmark = reader.bookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });

    it('can add a new bookmark', function (done) {
      var bookmark = reader.addBookmark(
        'http://some.url.com/article.html', function (err, bookmark) {
          assert.equal(err, null);
          assert.equal(bookmark.id, '75');
          done();
        });
    });

    it('can archive a bookmark', function (done) {
      var bookmark = reader.archiveBookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });

    it('can unarchive a bookmark', function (done) {
      var bookmark = reader.unarchiveBookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });

    it('can favourite a bookmark', function (done) {
      var bookmark = reader.favouriteBookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });

    it('can unfavourite a bookmark', function (done) {
      var bookmark = reader.unfavouriteBookmark('75', function (err, bookmark) {
        assert.equal(err, null);
        assert.equal(bookmark.id, '75');
        done();
      });
    });

    it('can favourite using the favorite method', function () {
      assert.equal(reader.favoriteBookmark, reader.favouriteBookmark);
    });

  });

  describe('Tags', function () {

    it('can get all of the tags for the current user', function (done) {
      var tags = reader.userTags(function (err, tags) {
        assert.equal(err, null);
        assert.equal(tags.length, 4);
        done();
      });
    });

    it('can get the tags for a bookmark', function (done) {
      var tags = reader.tags('75', function (err, tags) {
        assert.equal(err, null);
        assert.equal(tags.length, 4);
        done();
      });
    });

    it('can add a tag to a bookmark', function (done) {
      var bookmark = reader.addTags('75', ['tag1', 'tag2', 'tag3'],
        function (err, tags) {
          assert.equal(err, null);
          assert.equal(tags.length, 4);
          done();
        });
    });

    it('can remove a tag from a bookmark', function (done) {
      var bookmark = reader.removeTag('75', '123',
        function (err, success) {
          assert.equal(err, null);
          assert.ok(success);
          done();
        });
    });

  });

  describe('Articles', function () {

    it('can get an article by its ID', function (done) {
      var article = reader.article('47g6s8e7', function (err, article) {
        assert.equal(err, null);
        assert.equal(article.id, '47g6s8e7');
        done();
      });
    });

  });

});