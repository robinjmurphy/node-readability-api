var assert = require('assert');

describe('readability-api', function () {
  
  var readability = require('../index');

  it('has a reader function', function () {
    assert.ok('reader' in readability);
  });

  it('has a configure function', function () {
    assert.ok('configure' in readability);
  });

});