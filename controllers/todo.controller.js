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
  const todos = await TodoModel.find({});
  return res.status(200).json(todos);
};
