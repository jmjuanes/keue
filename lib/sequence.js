//Build the sequence of tasks to run
module.exports = function(tasks, names) {
    let sequence = [];
    let tree = [];
    let sequenceRecursive = function(list) {
        list.forEach(function(name) {
            let task = tasks[name];
            //Check if task is in the list
            if(sequence.indexOf(name) !== -1) {
                return;
            }
            //Check if this task exists in the list
            if(typeof task !== "object") {
                throw new Error("Missing task " + name);
            }
            //Check for recursive dependency
            if(tree.indexOf(name) !== -1) {
                tree.push(name);
                throw new Error("Recursive dependencies: " + tree.join(" > "));
            }
            //Check if this task has dependencies
            if(typeof task.dependencies === "object") {
                tree.push(name);
                sequenceRecursive(task.dependencies);
                tree.pop();
            }
            //Add this task to the list
            sequence.push(name);
        });
    };
    //Generate the sequence of tasks recursive
    sequenceRecursive(names);
    //Return the generated sequence
    return sequence;
};
