"use strict";

var server = require("../../index.js");
var pkg = require("../../package.json");

var Lab = require("lab");
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var it = lab.test;
var Code = require("code");
var expect = Code.expect;

describe("Todos", function () {
  it("should return API info on main endpoint request", function (done) {
    var options = {
      method: "GET",
      url: "/"
    };

    server.inject(options, function (response) {
      var result = response.result;

      expect(response.statusCode).to.equal(200);
      expect(result.version).to.equal(pkg.version);

      done();
    });
  });

  it("should return list of todos for given IP Address to /todos", function (done) {
    var options = {
      method: "GET",
      url: "/todos"
    };

    server.inject(options, function (response) {
      var result = response.result;
      var todos = result.todos;

      expect(response.statusCode).to.equal(200);
      expect(todos).to.be.an.array();
      expect(todos).to.have.length(5);
      done();
    });
  });

  it("should return a single requested todo for given IP Address", function (done) {
    var options = {
      method: "GET",
      url: "/todos/37cf8afa-6474-47d7-a81b-910b721f69b2"
    };

    server.inject(options, function (response) {
      var result = response.result;
      var todo = result.todo;

      expect(response.statusCode).to.equal(200);
      expect(todo).to.be.an.object();
      expect(todo.hasOwnProperty("id")).to.be.true;

      done();
    });
  });
});
