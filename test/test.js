//Import dependencies
var assert = require('assert');
var keue = require('../index.js');

describe('keue', function()
{
  it('should execute all provided functions', function(done)
  {
    var executed1 = false;
    var executed2 = false;
    var k = keue(function(next)
    {
      executed1 = true;
      return next(null);
    });

    k.then(function(next)
    {
      executed2 = true;
      setTimeout(function(){ return next(); }, 100);
    });

    k.finish(function(error)
    {
      assert.equal(error, null);
      assert.equal(executed1, true);
      assert.equal(executed2, true);
      done();
    });
  });

  it('should stop the queue when a function returns an error', function(done)
  {
    var executed1 = false, executed2 = false, executed3 = false;
    var k = keue(function(next)
    {
      executed1 = true;
      return next();
    });

    k.then(function(next)
    {
      executed2 = true;
      return next(new Error('Something went wrong'));
    });

    k.then(function(next)
    {
      executed3 = true;
      //This function will never be executed
      return done(new Error('Error'));
    });

    k.finish(function(error)
    {
      assert.notEqual(error, null);
      assert.equal(executed1, true);
      assert.equal(executed2, true);
      assert.equal(executed3, false);
      return done();
    });
  });
});