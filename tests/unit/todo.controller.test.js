const TodoController = require("../../controllers/todo.controller");
const httpMocks = require("node-mocks-http");
const TodoModel = require("../../models/todo.model");
const newTodo = require("../mock-data/new-todo.json");
const createdTodo = require("../mock-data/created-todo.json");
const todos = require("../mock-data/all-todos.json");

let req, res, next;

TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
next = jest.fn();

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

describe("TodoConller.getTodos", () => {
  it("has a getTodos method", () => {
    expect(typeof TodoController.getTodos).toBe("function");
  });
  it("calls TodoModel with empty where clause", async () => {
    await TodoController.getTodos(req, res, next);
    expect(TodoModel.find).toHaveBeenCalledWith({});
  });
  it("it returns all todo models in response", async () => {
    TodoModel.find.mockReturnValue(todos);
    await TodoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(todos);
  });
});

describe("TodoController.addTodo", () => {
  it("has a saveTodo method", () => {
    expect(typeof TodoController.addTodo).toBe("function");
  });

  it("saves TodoModel with passed arguments", () => {
    req.body = newTodo;
    TodoController.addTodo(req, res, next);
    expect(TodoModel.create).toHaveBeenCalledWith(newTodo);
  });
  it("returns response with 201 & json body", async () => {
    req.body = newTodo;
    TodoModel.create.mockReturnValue(createdTodo);
    await TodoController.addTodo(req, res, next);
    const json = res._getJSONData();
    expect(json).toEqual(createdTodo);
    expect(res.statusCode).toBe(201);
  });
  it("returns a error on wrong input", async () => {
    req.body = { title: "miss done property" };
    const errorMessage = {
      message: "Todo validation failed: done: Path `done` is required."
    };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise);
    await TodoController.addTodo(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});
