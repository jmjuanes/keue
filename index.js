//Import dependencies
var util = require('util');
var events = require("events");
var utily = require('utily');

//Keue object
var keue = function()
{
  //Initialize the functions list
  this.list = [];

  //Extend with the events emitter
  events.EventEmitter.call(this);

  //Return this
  return this;
};

//Inherit from EventEmitter
util.inherits(keue, events.EventEmitter);

//Add a new function
keue.prototype.then = function(name, listener)
{
  //Check the arguments
  if(typeof name === 'function')
  {
    //Add the new function
    this.list.push({ name: null, listener: name });
  }
  else if(typeof name === 'string' && typeof listener === 'function')
  {
    //Add the new function
    this.list.push({ name: name, listener: listener });
  }
  else
  {
    //Throw a new error
    throw new Error('Invalid arguments in keue.then method');
  }

  //Return this
  return this;
};

//Run the keue
keue.prototype.run = function(cb)
{
  //Check the number of functions to execute
  if(this.list.length === 0){ return; }

  //Save this
  var self = this;

  //queue list iterator
  var queue_iterator = function(index, item, done)
  {
    //Call the listener method
    return item.listener(function(error)
    {
      //Check the error object
      if(typeof error === 'object' && error instanceof Error)
      {
        //Emit the error event and stop the queue
        return self.emit('error', error);
      }
      else
      {
        //Continue with the next function in the queue
        return done();
      }
    });
  };

  //Queue list done
  var queue_done = function()
  {
    //Emit the finish event
    self.emit('finish');

    //Check the callback method
    if(typeof cb === 'function')
    {
      //Call the provided callback
      return cb();
    }
  };

  //Initialize the queue
  return utily.eachAsync(this.list, queue_iterator, queue_done);
};

//Exports the keue object
module.exports = keue;
