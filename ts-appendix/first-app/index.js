"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var url = 'https://jsonplaceholder.typicode.com/todos/1';
axios_1["default"].get(url).then(function (response) {
    var todo = response.data;
    var ID = todo.id;
    var title = todo.title;
    var finished = todo.completed;
    logTodo(ID, title, finished);
});
var logTodo = function (id, title, finished) {
    console.log("\n   The Todo with ID: ".concat(id, " \n   Has a title of: ").concat(title, "\n   Is it finished? ").concat(finished, "\n   "));
};
