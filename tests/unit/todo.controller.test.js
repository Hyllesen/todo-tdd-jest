const { when } = require("jest-when");
const TodoController = require("../../controllers/todo.controller");
const httpMocks = require("node-mocks-http");
const TodoModel = require("../../models/todo.model");
const newTodo = require("../mock-data/new-todo.json");
const createdTodo = require("../mock-data/created-todo.json");

TodoModel.save = jest.fn();

let req, res, next;

describe("TodoController", () => {
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });
  it("saves TodoModel with passed arguments", () => {
    req.body = newTodo;
    TodoController.saveTodo(req);
    expect(TodoModel.save).toHaveBeenCalledWith(newTodo);
  });
  it("returns response with 201 & json body", async () => {
    req.body = newTodo;
    TodoModel.save.mockReturnValue(createdTodo);
    await TodoController.saveTodo(req, res, next);
    const json = res._getJSONData();
    expect(json).toEqual(createdTodo);
    expect(res.statusCode).toBe(201);
  });
});
