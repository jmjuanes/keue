<div align="center">
	<img width="300" src="https://cdn.rawgit.com/jmjuanes/keue/c7658084cd53c010be2a54b8c8e78a88eb7b330e/media/logo.svg" alt="keue">
	<br>
</div>

# keue

> Dead simple asynchronous functions queue

[![npm](https://img.shields.io/npm/v/keue.svg?style=flat-square)](https://www.npmjs.com/package/keue)
[![npm](https://img.shields.io/npm/dt/keue.svg?style=flat-square)](https://www.npmjs.com/package/keue)
[![npm](https://img.shields.io/npm/l/keue.svg?style=flat-square)](https://github.com/jmjuanes/keue)

## Install

You can install the latest version of the package using **npm**:

```
$ npm install --save keue
```

## Usage

```javascript
//Import package
var keue = require('keue');

//Initialize the queue
var k = keue(function(next)
{
  //Do some stuff
  //...

  //Next function on the queue
  return next();
});

//Add a new function to execute
k.then(function(next)
{
  //Call an asynchronous function
  my_async_function(function(error)
  {
    //Check the error 
    if(error)
    {
      //Stop the queue and send the error to the finish method 
      return next(error);
    }
    
    //Do some stuff
    //...

    //Continue with the next function on the queue
    return next();
  });
});

//Queue is finished
k.finish(function(error)
{
  //Check if there is an error running the queue
  if(error){ /* something went wrong */ } 
  
  //Continue 
  //...
});
```

## API

### var k = keue(handler);

Initialize the queue and set the first function to execute in the queue. 

```javascript
var k = keue(function(next)
{
  //This will be the first function that will be called.
  //Write your magic and execute the next method to continue with the next function in the queue
  
  //...
  
  //Continue with the next function 
  return next();
});
```

### k.then(handler);

Add a new function on the queue. This method accepts a function that will be added to the queue list.

The provided function will be called with the following arguments:

- `next`: a function that starts the next function on the queue. If you call this function with an `Error` object, the queue will be finished and the `error` object will be passed to the `finish` function.

````javascript
//Add a new function to the queue
k.then(function(next)
{
  //If something went wrong running the queue, you can abort it 
  //by calling the next function with an error object 
  if(/* something went wrong */)
  {
    //Abort the queue 
    return next(new Error('Something went wrong'));
  }
  else
  {
    //Continue with the next function 
    return next();
  }
});
````

### k.finish(handler);

Set the function that will be called when all functions in the queue are completed. The function will be called with an `Error` object if something went wrong running the queue. 

```javascript
k.finish(function(error)
{
  //Check the error object 
  if(error)
  {
    //Something went wrong and the queue was aborted
  }
});
```

## License

[MIT](./LICENSE) &copy; Josemi Juanes.
