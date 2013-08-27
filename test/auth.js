var auth = require('../lib/auth');
var support = require('./support');
var assert = require('assert');

describe('auth', function () {

  beforeEach(function () {
    support.configureClient();
    support.resetMocks();
  });

  describe('.xauth()', function () {
    it('should return an authenticated OAuth token and token secret', function (done) {
      support.mockWithContent('GET', '/oauth/access_token/', 200,
        'oauth_token=some_token&oauth_token_scret=some_token_secret&oauth_callback_confirmed=true');
      
      auth.xauth('some_username', 'some_password', function (err, tokens) {
        assert.equal(err, null);
        assert.equal(tokens.oauth_token, 'some_token');
        assert.equal(tokens.oauth_token_scret, 'some_token_secret');
        done();
      });
    });

    describe('when user credentials are invalid', function () {
      it('should return an error', function (done) {
        support.mockWithContent('GET', '/oauth/access_token/', 401,
          'Invalid user credentials.');

        auth.xauth('some_username', 'some_password', function (err, tokens) {
          assert.equal(err.message, 'HTTP 401: Invalid user credentials.');
          assert.equal(tokens, null);
          done();
        });
      });
    })
  });

});