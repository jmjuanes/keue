<div align="center">
	<img width="300" src="https://cdn.rawgit.com/jmjuanes/keue/c7658084cd53c010be2a54b8c8e78a88eb7b330e/media/logo.svg" alt="keue">
	<br>
</div>

# keue

> Dead simple asynchronous functions queue

[![npm](https://img.shields.io/npm/v/keue.svg?style=flat-square)](https://www.npmjs.com/package/keue)
[![npm](https://img.shields.io/npm/dt/keue.svg?style=flat-square)](https://www.npmjs.com/package/keue)

## Install

You can install the latest version of the package using **npm**:

```
$ npm install --save keue
```

## Usage

```javascript
//Import package
var keue = require('keue');

//Initialize the new queue
var k = new keue();

//Run a synchronous function
k.then(function(next)
{
  //Do some stuff
  //...

  //Next function on the queue
  return next();
});

//Run an asynchronous function
k.then(function(next)
{
  //Call an asynchronous function
  my_async_function(function()
  {
    //Do some stuff
    //...

    //Continue with the next function on the queue
    return next();
  });
});

//Run the queue
k.run();
```

## API

### var k = new keue();

Initialize the queue.

### Event: 'error'

The `error` event is emitted if the `next` function is called with an error object. 

```javascript
var k = new keue();

k.on('error', function(error)
{
  //Do something with the error
});

k.then(function(next)
{
  // . . . 
  
  //Call the next method with an error object 
  //This will stop the queue and emit the 'error' event
  return next(new Error('Some error'));
});

k.run();
```

### Event: 'finish'

This event is emitted when the queue is completed.

### k.then(handler);

Add a new function on the queue. This method accepts a function that will be added to the queue list.

The provided function will be called with the following arguments:

- `next`: a function that starts the next function on the queue. If you call this function with an `Error` object, the queue will be finished and the `error` event will be emitted with the provided error object.

### k.run();

Starts the queue.


## License

[MIT](./LICENSE) &copy; Josemi Juanes.
