## node-readability-client

[![Build Status](https://travis-ci.org/robinjmurphy/node-readability-api.png?branch=master)](https://travis-ci.org/robinjmurphy/node-readability-api)

This is Node client for the [Readability](http://www.readability.com/) API. It currently supports the [Reader API](http://www.readability.com/developers/api/reader), with plans to add support for the [Parser API](http://www.readability.com/developers/api/parser) and [Shortener API](http://www.readability.com/developers/api/shortener).

### Installation

```bash
npm install readability-client
```

Or, in your package.json

```json
{
    "dependencies": {
        "readability-client": "0.x"
    }
}
```

### Usage

Initialize the client

```javascript
var readability = require('readability-api');

readability.configure({
    consumer_key: 'some_consumer_key',
    consumer_secret: 'some_consumer_secret',
    parser_token: 'some_parser_token'
});
```

#### Reader API

To use the Reader API, create a Reader object using an OAuth token and token secret

```javascript
var reader = new readability.reader({
  access_token: 'some_access_token',
  access_token_secret: 'some_access_token_secret'
});
```

##### User information

```javascript
// Get information about the current user
reader.user(function (err, user) {
  //...
});
```

##### Bookmarks

```javascript
// Get all bookmarks - response contains both metadata (pagination etc.) and an array of bookmarks
reader.bookmarks(options, function (err, bookmarks) {
   //... 
});

// Get a bookmark by its id
reader.bookmark('some_bookmark_id', function (err, bookmark)) {
   //... 
});

// Add a bookmark - returns the created bookmark
reader.addBookmark('http://some.bookmark.url.com/article.html', function (err, bookmark) {
   //... 
});

// Remove a bookmark - success is a boolean
reader.addBookmark('some_bookmark_id', function (err, success) {
   //... 
});

// Archive a bookmark - returns the archived bookmark
reader.archiveBookmark('some_bookmark_id', function (err, bookmark) {
   //... 
});

// Unarchive a bookmark - returns the bookmark
reader.unarchiveBookmark('some_bookmark_id', function (err, bookmark) {
   //... 
});

// Favourite a bookmark - returns the favourited bookmark
reader.favouriteBookmark('some_bookmark_id', function (err, bookmark) {
   //... 
});

// Unavourite a bookmark - returns the bookmark
reader.unfavouriteBookmark('some_bookmark_id', function (err, bookmark) {
   //... 
});

```

##### Tags

```javascript
// Get all of the current user's tags - returns an array of tags
reader.userTags(function (err, tags) {
   //... 
});

// Get all of the tags for a bookmark - returns an array of tags
reader.tags('some_bookmark_id', function (err, tags) {
   //... 
});

// Add tags to a bookmark - returns an array of tags
reader.addTags('some_bookmark_id', ['tag1', 'tag2', 'tag3'], function (err, bookmark)) {
    //...
}

// Remove a tag from a bookmark - returns the bookmark
reader.removeTag('some_bookmark_id', 'some_tag_id', function (err, bookmark) {
   //... 
});
```

##### Articles

```javascript
// Get a single article
reader.article('some_article_id', function (err, article) {
   //... 
});
```
