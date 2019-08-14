const TodoModel = require("../models/todo.model");

exports.addTodo = async (req, res, next) => {
  try {
    const todoModelSaved = await TodoModel.create(req.body);
    return res.status(201).json(todoModelSaved);
  } catch (error) {
    next(error);
  }
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
    return res.status(200).json(todo);
  } catch (error) {
    error.statusCode = 404;
    next(error);
  }
};
