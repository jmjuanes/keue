//Import dependencies
var assert = require("assert");
var keue = require("../index.js");

describe("keue", function () {
    it("should execute all provided tasks", function (done) {
        var executed1 = false;
        var executed2 = false;
        var k = keue();
        k.addTask("task1", function (next) {
            executed1 = true;
            return next(null);
        });
        k.addTask("task2", function (next) {
            executed2 = true;
            setTimeout(function () {
                return next();
            }, 100);
        });
        k.run("task1", "task2");
        k.on("finish", function () {
            assert.equal(executed1, true);
            assert.equal(executed2, true);
            done();
        });
    });

    it("should stop the queue when a task emit an error", function (done) {
        var executed1 = false, executed2 = false, executed3 = false;
        var k = keue();
        k.addTask("task1", function (next) {
            executed1 = true;
            return next();
        });

        k.addTask("task2", function (next) {
            executed2 = true;
            return next(new Error("Aborting task"));
        });

        k.addTask("task3", function (next) {
            executed3 = true;
            return done(new Error("ERROR"));
        });
        k.on("finish", function () {
            return done(new Error("ERROR"));
        });
        k.on("error", function (error) {
            assert.notEqual(error, null);
            assert.equal(executed1, true);
            assert.equal(executed2, true);
            assert.equal(executed3, false);
            return done();
        });
        k.run("task1", "task2", "task3");
    });

    it("should prevent executing a task twice", function (done) {
        var executed1 = false, executed2 = false;
        var k = new keue();
        k.addTask("task1", function(next){
            executed1 = true;
            return next();
        });
        k.addTask("task2", function(next){
            executed2 = true;
            return next();
        });
        k.on("error", function(error){
            assert.notEqual(error, null);
            assert.equal(executed1, true);
            assert.equal(executed2, true);
            return done();
        });
        k.on("finish", function(){
            return done(new Error("ERROR"));
        });
        k.run("task1", "task2", "task1")
    });

    it("should call all defined tasks in order", function (done) {
        var executed1 = false, executed2 = false, executed3 = false;
        var order = [];
        var k = keue();
        k.addTask("task1", function (next) {
            executed1 = true;
            return next();
        });

        k.addTask("task2", function (next) {
            executed2 = true;
            return next();
        });

        k.addTask("task3", function (next) {
            executed3 = true;
            return next();
        });
        k.on("task:start", function(name){
            order.push(name.replace("task", ""));
        });
        k.on("finish", function () {
            assert.equal(executed1, true);
            assert.equal(executed2, true);
            assert.equal(executed3, true);
            assert.equal(order[0], "1");
            assert.equal(order[1], "2");
            assert.equal(order[2], "3");
            return done();
        });
        k.on("error", function () {
            return done(new Error("ERROR"))
        });
        k.run();
    });
});