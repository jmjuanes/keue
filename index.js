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
keue.prototype.then = function(listener)
{
  //Check the arguments
  if(typeof listener !== 'function')
  {
    //Throw a new error
    throw new Error('Invalid arguments in "keue.then" method');
  }

  //Add the new function
  this.list.push({ name: null, listener: listener });

  //Return this
  return this;
};

//Run the keue
keue.prototype.run = function()
{
  //Check the number of functions to execute
  if(this.list.length === 0)
  {
    //Emit the finish event and exit
    return this.emit('finish');
  }

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
    return self.emit('finish');
  };

  //Initialize the queue
  return utily.eachAsync(this.list, queue_iterator, queue_done);
};

//Exports the keue object
module.exports = keue;
