//Import keue
var keue = require('./index.js');

//Get the new keue object
var k = new keue();

//Error event listener
k.on('error', function(error)
{
  //Display the error message in console
  console.error(error.message);
});

//Finish event listener
k.on('finish', function()
{
  //Display in logs
  console.log('-> Queue finished!');
});

//Run a function
k.then(function(next)
{
  //Add a time out
  setTimeout(function(){ return next(); }, 2000);
});

//Run a function
k.then(function(next)
{
  //Abort the queue
  //return next(new Error('Some error...'));
  return next();
});

//Run the queue
k.run();