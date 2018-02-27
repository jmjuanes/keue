<div align="center">
	<img width="300" src="https://cdn.rawgit.com/jmjuanes/keue/c7658084cd53c010be2a54b8c8e78a88eb7b330e/media/logo.svg" alt="keue">
	<br>
</div>

# keue

> Asynchronous tasks orchestration

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

//Generate a new instance
var tasks = new keue();

//Register a new sync task 
tasks.addTask("task1", function (done) {
    //Do some stuff
    //...
    
    //Call the done method when the task is completed
    return done();
});

//Register a new async task
tasks.addTask("task2", function (done) {
    //Call an asynchronous function
    return myAsyncFunction(function (error) {
        if (error) {
            //If something went wrong, you can stop the tasks execution
            //calling done method with an error object
            return done(error);
        }
        
        //Do some stuff
        //...
        
        //Task completed
        return done();
    });
});

//Finish listener
k.on("finish", function () {
  //Tasks finished successfully
  //...
});

//Task error listener 
k.on("error", function (error) {
    //Error running a task
});

//Run the tasks 
tasks.run("task1", "task2");
```

## API

### var tasks = new keue();

Initialize tasks manager.

```javascript
var tasks = new keue();
```

### tasks.addTask(name, handler);

Register a new task called `name`. The second argument is a function that will be called with the following arguments:

- `done`: a function that should be called when the task is completed. If you call this function with an `Error` object, the tasks queue will be finished and the `error` event will be triggered.

````javascript
//Add a new task to the queue
tasks.addTask("task1", function(done) {
    //If something went wrong running the queue, you can abort it 
    //by calling the next function with an error object 
    if(/* something went wrong */) {
        //Abort the task 
        return done(new Error('Something went wrong'));
    } else {
        //Task completed without error
        return done();
    }
});
````

### tasks.removeTask(name)

Removes the task called `name` from the tasks list (if exists).

```javascript
tasks.removeTask("task4");
```

### tasks.run(tasks...);

Start running the list of provided tasks. This methods accepts a string or an array of strings. The tasks will be executed in the order that you provide to the `tasks.run` method.

```javascript
tasks.run("task3", "task2", "task1"); //First will be executed "task3", then "task2" and last "task1".
```

This method will fire the `start` event. 


### tasks.on(eventName, eventListener)

Register the `eventListener` function as a listener of the `eventName` event. 

#### event start

The tasks queue started.

```javascript
tasks.on("start", function () {
    //The task queue started
});
```

#### event finish

This event will be fired when the tasks queue finished successfully.

```javascript
tasks.on("finish", function () {
    //Tasks finished
});
```

#### event error

Fired when the tasks queue was aborted due to a task error.

```javascript
tasks.on("error", function (error) {
    //Tasks aborted
});
```

#### event task:start

Fired when a task was started.

```javascript
tasks.on("task:start", function (name) {
    console.log("Task " + name + " started");
});
```

#### event task:end 

Fired when a task was completed without error. 

```javascript
tasks.on("task:end", function (name) {
    console.log("Task " + name + " completed!");
});
```


## License

[MIT](./LICENSE) &copy; Josemi Juanes.
