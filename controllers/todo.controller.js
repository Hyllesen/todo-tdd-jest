const TodoModel = require("../models/todo.model");

exports.addTodo = async (req, res, next) => {
  try {
    const todoModelSaved = await TodoModel.create(req.body);
    return res.status(201).json(todoModelSaved);
  } catch (error) {
    next(error);
  }
};

exports.updateTodo = async (req, res, next) => {
  const updatedModel = TodoModel.findByIdAndUpdate(req.params.todoId);
  return res.status(200).json(updatedModel);
};

exports.getTodos = async (req, res, next) => {
  try {
    const todos = await TodoModel.find({});
    return res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    const todo = await TodoModel.findById(req.params.todoId);
    if (todo) {
      return res.status(200).json(todo);
    } else {
      const error = new Error(
        "Could not find todo with id " + req.params.todoId
      );
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
