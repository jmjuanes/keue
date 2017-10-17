//Import dependencies
var utily = require('utily');

//Keue object
var keue = function(cb)
{
  //Check the cb method
  if(typeof cb !== 'function')
  {
    //Throw a new error
    throw new Error('No function provided on constructor method');
  }

  //Check the instance
  if(!(this instanceof keue))
  {
    //Return a new instance of the keue method
    return new keue(cb)
  }

  //Initialize the functions list
  this.list = [];

  //Register the first method
  this.list.push({ name: null, listener: cb });

  //Return this
  return this;
};

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

//Finish method -> Set the latest function and start the queue
keue.prototype.finish = function(cb)
{
  //Check the latest callback method
  if(typeof cb !== 'function')
  {
    //Throw the error
    throw new Error('No latest function to run provided');
  }

  //Check the number of functions to execute
  if(this.list.length === 0)
  {
    //Call the latest function
    return cb.call(null, null);
  }

  //queue list iterator
  var queue_iterator = function(index, item, done)
  {
    //Call the listener method
    return item.listener.call(null, function(error)
    {
      //Check the error object
      if(typeof error === 'object' && error instanceof Error)
      {
        //Call the finish method with the error
        return cb.call(null, error);
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
    //Call the finish function
    return cb.call(null, null);
  };

  //Initialize the queue
  return utily.eachAsync(this.list, queue_iterator, queue_done);
};

//Exports the keue object
module.exports = keue;
