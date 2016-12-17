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

### k.then(handler);

Add a new function on the queue. This method accepts a function that will be added to the queue list.

The provided function will be called with the following arguments:

- `next`: a function that starts the next function on the queue.

### k.on(name, handler);

Add a new event listener, where:

- `name`: event name.
- `handler`: the function that will be called with the event.

#### k.on('error', handler);

Emit the provided function if there was an error running the queue.

```javascript
k.on('error', function(message)
{
  //An error occurred
  console.log(message);
});
```

#### k.on('end', handler);

Emit the provided function when the queue is completed.

```javascript
k.on('end', function()
{
  //End of the queue reached
  //...
});
```

### k.run();

Starts the queue.


## License

[MIT](./LICENSE) &copy; Josemi Juanes.
