const TodoModel = require("../models/todo.model");

exports.addTodo = async (req, res, next) => {
  const todoModelSaved = await TodoModel.create(req.body);
  return res.status(201).json(todoModelSaved);
};
