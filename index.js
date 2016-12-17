//Keue object
var keue = function()
{
  //Initialize the functions list
  this._list = [];

  //Events
  this._events = {};

  //Return this
  return this;
};

//Emit an event
keue.prototype.emit = function(name, message)
{
  //Check the event
  if(typeof this._events[name] !== 'function'){ return this; }

  //Emit the event
  this._events[name](message);

  //Continue
  return this;
};

//Add a new event
keue.prototype.on = function(name, listener)
{
  //Check the event name
  if(typeof name !== 'string'){ return this; }

  //Check the listener
  if(typeof listener !== 'function'){ return this; }

  //Add the event
  this._events[name] = listener;

  //Return this
  return this;
};

//Add a new function
keue.prototype.then = function(listener)
{
  //Add the new function
  this._list.push(listener);

  //Return this
  return this;
};

//Run the keue
keue.prototype.run = function()
{
  //Check the number of functions to execute
  if(this._list.length === 0){ return this.emit('error', 'No functions to run'); }

  //Initialize the queue
  return keue_recursive(this, 0);
};

//Run the function recursive
var keue_recursive = function(self, index)
{
  //Check the index
  if(index >= self._list.length)
  {
    //Call the end event and exit
    return self.emit('end', '');
  }

  //Call the function
  self._list[index](function()
  {
    //Continue with the next function on the queue
    return keue_recursive(self, index + 1);
  });

  //Return
  return;
};

//Exports to node
if(typeof module === "object" && module.exports)
{
  //Exports the keue object
  module.exports = keue;
}
