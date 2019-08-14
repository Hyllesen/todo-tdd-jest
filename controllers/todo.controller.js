const TodoModel = require("../models/todo.model");

exports.saveTodo = async (req, res, next) => {
  const todoModelSaved = await TodoModel.save(req.body);
  return res.status(201).json(todoModelSaved);
};
