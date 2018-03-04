let EventEmitter = require("events").EventEmitter;
let util = require("util");

let buildSequence = require("./lib/sequence.js");

//Keue object
let Keue = function (options) {
    if (typeof options !== "object" || options === null) {
        let options = {};
    }
    if (!(this instanceof Keue)) {
        //Return a new instance of the keue method
        return new Keue(options)
    }
    //EventEmitter.call(this); //Extend the events class
    this._tasks = {}; //Tasks list
    this._running = false; //Tasks are running
    this._events = new EventEmitter(); //Event emitter
    return this;
};

//Register a new event listener
Keue.prototype.on = function (name, listener) {
    this._events.on(name, listener);
    return this;
};

//Register a new task
Keue.prototype.addTask = function (name, dependencies, listener) {
    if (!listener && typeof dependencies === "function") {
        listener = dependencies;
        dependencies = [];
    }
    if (typeof name !== "string") {
        throw new Error("Task requires a name");
    }
    if (name.trim().length === 0) {
        throw new Error("Task name has to be a non-empty string");
    }
    if (typeof listener !== "function") {
        throw new Error("Task '" + name + "' requires a function");
    }
    if (Array.isArray(dependencies) === false) {
        if (typeof dependencies === "string") {
            dependencies = [dependencies];
        } else {
            throw new Error("Dependencies should be a string or an array of strings");
        }
    }
    //Register this task
    this._tasks[name] = {name: name, dependencies: dependencies, listener: listener, done: false};
    return this;
};

//Check if the provided task has been defined
Keue.prototype.hasTask = function (name) {
    return typeof this._tasks[name] === "object";
};

//Remove the task
Keue.prototype.removeTask = function (name) {
    if (this.hasTask(name) === true) {
        delete this._tasks[name];
    }
    return this;
};

//Start the tasks
Keue.prototype.run = function () {
    let self = this;
    let names = [];
    //Check if the queue is already running
    if (this._running === true) {
        return;
    }
    //Check the current number of tasks
    if (Object.keys(this._tasks).length === 0) {
        throw new Error("Empty tasks list");
    }
    //Parse all the arguments
    Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
        if (typeof arg === "string") {
            names.push(arg);
        } else if (Array.isArray(arg) === true) {
            names = names.concat(arg);
        } else {
            throw new Error("Invalid task name provided");
        }
    });
    if (names.length < 1) {
        //Run all tasks
        Object.keys(this._tasks).forEach(function (name) {
            names.push(name);
        });
    }
    //Generate the correct sequence of tasks
    let sequence = buildSequence(this._tasks, names);
    //Run a task
    let runTask = function (index) {
        if (index >= sequence.length) {
            //Tasks finished
            self._running = false;
            return self._events.emit("finish");
        }
        let task = self._tasks[sequence[index]];
        //Check for not found task
        if (typeof task !== "object" || task === null) {
            self._running = false;
            return self._events.emit("error", new Error("Task '" + sequence[index] + "' not found"));
        }
        //Check if the task has already executed
        if (task.done === true) {
            self._running = false;
            return self._events.emit("error", new Error("Task '" + task.name + "' has been already completed"));
        }
        //task.start = Date.now();
        self._events.emit("task:start", task.name);
        return task.listener.call(null, function (error) {
            //Check for error running the task
            if (error) {
                self._running = false;
                return self._events.emit("error", error);
            }
            //task.end = Date.now();
            task.done = true;
            self._events.emit("task:end", task.name);
            return process.nextTick(function () {
                //Continue with the next task in the queue
                return runTask(index + 1);
            });
        });
    };
    this._running = true;
    this._events.emit("start");
    process.nextTick(function () {
        //Initialize the task queue in the next tick. This prevents errors
        //when the event listeners are defined after executing the run method
        return runTask(0);
    });
    return this;
};

module.exports = Keue;
