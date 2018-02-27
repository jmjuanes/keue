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

    it("should stop the queue when the keue.abort method is called", function (done) {
        var executed1 = false, executed2 = false, executed3 = false;
        var k = keue();
        k.addTask("task1", function (next) {
            executed1 = true;
            return next();
        });

        k.addTask("task2", function (next) {
            executed2 = true;
            k.abort(new Error("Something went wrong"));
            return next();
        });

        k.addTask("task3", function (next) {
            executed3 = true;
            return done(new Error("Error"));
        });
        k.run("task1", "task2", "task3");
        k.on("finish", function() {
            return done(new Error("Error"));
        });
        k.on("abort", function (error) {
            assert.notEqual(error, null);
            assert.equal(executed1, true);
            assert.equal(executed2, true);
            assert.equal(executed3, false);
            return done();
        });
    });
});