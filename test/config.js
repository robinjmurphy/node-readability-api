var assert = require('assert');

describe('config', function () {
  
  var config = require('../lib/config');

  describe('.set()', function () {
    it('should set the global configuration', function () {
      config.set({
        consumer_key: 'some_consumer_key',
        consumer_secret: 'some_consumer_secret',
        parser_token: 'some_parser_token'
      });

      var conf = config.get();

      assert.equal(conf.consumer_key, 'some_consumer_key');
      assert.equal(conf.consumer_secret, 'some_consumer_secret');
      assert.equal(conf.parser_token, 'some_parser_token');
    });
  });

});