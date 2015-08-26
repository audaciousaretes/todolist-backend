var Hapi = require("hapi");
var pkg = require("./package.json");
var uuid = require("node-uuid");

var server = new Hapi.Server();
server.connection({ port: 8080, routes: { cors: true } });

var TodosStore = function () {
  return {};
};

var todos = new TodosStore();

var rootHandler = function (request, reply) {
  reply({
    version: pkg.version,
    title: pkg.title,
    name: request.query.name ? request.query.name : "no name provided.",
    favorite_food: request.query.favorite_food ? request.query.favorite_food: "no favorite food provided."
  });
};

var rootRoute = {
  path: "/",
  method: "GET",
  handler: rootHandler
};

var setTodos = function (address) {
  todos[address] = [
    { id: "37cf8afa-6474-47d7-a81b-910b721f69b2", description: "Get milk.", status: "incomplete" },
    { id: "d5e9bdef-d761-4568-be4e-417faed22f8c", description: "Build something awesome.", status: "incomplete" },
    { id: "1037cd64-b750-49fa-9d00-d39db7daeac1", description: "Come to class.", status: "complete" },
    { id: "9c9ed00b-11df-450a-a589-017ee0cadb6f", description: "Give the dog a bath.", status: "deferred" },
    { id: "a9c6076b-f405-495e-bc82-0f0814b920a0", description: "Check email.", status: "incomplete" }
  ];
};

var getTodosHandler = function (request, reply) {
  var address = request.info.remoteAddress;
  if (!todos[address]) setTodos(address);

  reply({
    todos: todos[address]
  });
};

var getTodosRoute = {
  path: "/todos",
  method: "GET",
  handler: getTodosHandler
};

var getTodoHandler = function (request, reply) {
  var address = request.info.remoteAddress;
  if (!todos[address]) setTodos(address);

  var foundTodo = todos[address].filter(function (todo) {
    if (todo.id === request.params.id) {
      return true;
    }
    return false;
  });

  reply({
    todo: foundTodo[0]
  });
};

var getTodoRoute = {
  path: "/todos/{id}",
  method: "GET",
  handler: getTodoHandler
};

var createTodoHandler = function (request, reply) {
  var address = request.info.remoteAddress;
  if (!todos[address]) setTodos(address);

  var todo = {
    id: uuid.v1(),
    description: request.payload.description,
    status: "incomplete"
  };

  todos[address].push(todo);
  reply(todo);
};

var createTodoRoute = {
  path: "/todos",
  method: "POST",
  handler: createTodoHandler
};

var editTodoHandler = function (request, reply) {
  var address = request.info.remoteAddress;

  if (!todos[address]) return reply({ error: "Whoops, you need some todos first!" });

  var foundTodo = todos[address].filter(function (todo) {
    if (todo.id === request.params.id) {
      return true;
    }
    return false;
  });

  var todo = foundTodo[0];

  todo.description = request.payload.description ? request.payload.description : todo.description;
  todo.status = request.payload.status ? request.payload.status : todo.status;

  reply(todo);
};

var editTodoRoute = {
  path: "/todos/{id}",
  method: "PUT",
  handler: editTodoHandler
};

var deleteTodoHandler = function (request, reply) {
  var address = request.info.remoteAddress;
  var todoPlace;

  if (!todos[address]) return reply({ error: "Whoops, you need some todos first!" });

  var foundTodo = todos[address].filter(function (todo, i) {
    if (todo.id === request.params.id) {
      return true;
      if (!todoPlace) todoPlace = i;
    }
    return false;
  });

  if (!foundTodo.length) return reply({ error: "No todo with that id!" });

  todos[address].splice(todoPlace, 1);

  reply(foundTodo);
};

var deleteTodoRoute = {
  path: "/todos/{id}",
  method: "DELETE",
  handler: deleteTodoHandler
};

server.route([
  rootRoute,
  getTodosRoute,
  getTodoRoute,
  createTodoRoute,
  editTodoRoute,
  deleteTodoRoute
]);

if (!module.parent) {
    server.start(function () {
        console.log("Server started at:", server.info.uri);
    });
}

module.exports = server;
