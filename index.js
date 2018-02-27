let EventEmitter = require("events").EventEmitter;
let util = require("util");

//Keue object
let Keue = function (options) {
    if (typeof options !== "object" || options === null) {
        let options = {};
    }
    if (!(this instanceof Keue)) {
        //Return a new instance of the keue method
        return new Keue(options)
    }
    EventEmitter.call(this); //Extend the events class
    this._tasks = {}; //Tasks list
    this._running = false; //Tasks are running
    return this;
};

//Inherit methods from EventListener class
util.inherits(Keue, EventEmitter);

//Register a new task
Keue.prototype.addTask = function (name, listener) {
    if (typeof name !== "string") {
        throw new Error("Task requires a name");
    }
    if (name.trim().length === 0) {
        throw new Error("Task name has to be a non-empty string");
    }
    if (typeof listener !== "function") {
        throw new Error("Task '" + name + "' requires a function");
    }
    //Register this task
    this._tasks[name] = {name: name, listener: listener, start: null, end: null, done: false};
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
    let tasks = [];
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
            tasks.push(arg);
        } else if (Array.isArray(arg) === true) {
            tasks = tasks.concat(arg);
        } else {
            throw new Error("Invalid task name provided");
        }
    });
    if (tasks.length < 1) {
        //Run all tasks
        Object.keys(this._tasks).forEach(function (name) {
            tasks.push(name);
        });
    }
    //Run a task
    let runTask = function (index) {
        //Check if the tasks queue has been aborted
        if (self._running === false) {
            return;
        }
        if (index >= tasks.length) {
            //Tasks finished
            return self.emit("finish");
        }
        let task = self._tasks[tasks[index]];
        //Check for not found task
        if (typeof task !== "object" || task === null) {
            //Emit the task error event and abort the tasks
            let error = new Error("Task '" + tasks[index] + "' not found");
            self.emit("task:error", {task: tasks[index], error: error, message: "Task not found"});
            return self.abort();
        }
        //Check if the task has already executed
        if(task.done === true) {
            let error = new Error("Task '" + task.name + "' has been already completed");
            self.emit("task:error", {task: task.name, error: error, message: "Task already completed"});
            return self.abort();
        }
        task.start = Date.now();
        self.emit("task:start", {task: task.name});
        return task.listener.call(null, function (error) {
            if(error) {
                //Emit the task error event
                let error = new Error("Error running task '" + tasks[index] + "'");
                self.emit("task:error", {task: task.name, error: error, message: "Error running task"});
                return self.abort();
            }
            //Check if the tasks queue has been aborted
            if (self._running === false) {
                return;
            }
            task.end = Date.now();
            task.done = true;
            self.emit("task:end", {task: task.name, time: task.end - task.start});
            return process.nextTick(function () {
                //Continue with the next task in the queue
                return runTask(index + 1);
            });
        });
    };
    this._running = true;
    this.emit("start");
    runTask(0);
};

//Abort the tasks queue
Keue.prototype.abort = function () {
    if (this._running === true) {
        //Stop the queue and emit the abort event
        this._running = false;
        this.emit("abort");
    }
};

module.exports = Keue;
