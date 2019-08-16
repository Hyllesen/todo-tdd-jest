const TodoController = require("../../controllers/todo.controller");
const httpMocks = require("node-mocks-http");
const TodoModel = require("../../models/todo.model");
const newTodo = require("../mock-data/new-todo.json");
const createdTodo = require("../mock-data/created-todo.json");
const updatedTodo = require("../mock-data/updated-todo.json");
const todos = require("../mock-data/all-todos.json");

let req, res, next;

jest.mock("../../models/todo.model");
next = jest.fn();

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
});

describe("TodoController.deleteTodo", () => {
  beforeEach(() => {
    req.params.todoId = createdTodo._id;
  });

  it("has a deleteTodo method", () => {
    expect(typeof TodoController.deleteTodo).toBe("function");
  });
  it("it should call findbyidandDelete", async () => {
    await TodoController.deleteTodo(req, res, next);
    expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(createdTodo._id);
  });
  it("should return deleted todo", async () => {
    const deletedTodoModelPromise = Promise.resolve(createdTodo);
    TodoModel.findByIdAndDelete.mockReturnValue(deletedTodoModelPromise);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(createdTodo);
  });
  it("should return error 404", async () => {
    const nullPromise = Promise.resolve(null);
    TodoModel.findByIdAndDelete.mockReturnValue(nullPromise);
    await TodoController.deleteTodo(req, res, next);
    expect(res.statusCode).toBe(404);
  });
  it("should return error 500", async () => {
    const errorMessage = {
      message: "Error deleting todo"
    };
    const deletedTodoRejectPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndDelete.mockReturnValue(deletedTodoRejectPromise);
    await TodoController.deleteTodo(req, res, next);
    expect(next).toBeCalledWith(expect.objectContaining(errorMessage));
  });
});

describe("TodoController.updateTodo", () => {
  beforeEach(() => {
    req.params.todoId = createdTodo._id;
  });

  it("has a updateTodo method", () => {
    expect(typeof TodoController.updateTodo).toBe("function");
  });

  it("call findByIdAndUpdate method on model", async () => {
    req.body = updatedTodo;
    await TodoController.updateTodo(req, res, next);
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(
      createdTodo._id,
      updatedTodo,
      {
        new: true,
        useFindAndModify: false
      }
    );
  });

  it("returns updated todo after update", async () => {
    const promise = Promise.resolve(updatedTodo);
    TodoModel.findByIdAndUpdate.mockReturnValue(promise);
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(updatedTodo);
  });

  it("returns 404 not found if no id", async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null);
    await TodoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual({ message: "Could not find id" });
  });

  it("returns 500 on invalid id", async () => {
    const errorMessage = { message: "Invalid object id" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await TodoController.updateTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("TodoController.getTodos", () => {
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
  it("returns an error", async () => {
    const errorMessage = { message: "Error getting data" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejectedPromise);
    await TodoController.getTodos(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("TodoController.getTodoById", () => {
  beforeEach(() => {
    req.params.todoId = "5d518ffa70a07c133362a37d";
  });
  it("has a getTodoById", () => {
    expect(typeof TodoController.getTodoById).toBe("function");
  });
  it("should lookup a TodoModel with request.params.todoId", async () => {
    await TodoController.getTodoById(req, res, next);
    expect(TodoModel.findById).toHaveBeenCalledWith(req.params.todoId);
  });

  it("should return the requested todo object", async () => {
    TodoModel.findById.mockReturnValue(createdTodo);
    await TodoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(createdTodo);
  });

  it("should do error handling", async () => {
    const errorMessage = {
      message: "Could not find todo with id not-existing-id",
      statusCode: 404
    };
    TodoModel.findById.mockReturnValue(null);
    req.params.todoId = "not-existing-id";
    await TodoController.getTodoById(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining(errorMessage));
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
