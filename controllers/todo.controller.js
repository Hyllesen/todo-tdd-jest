const TodoModel = require("../models/todo.model");

exports.saveTodo = async (req, res, next) => {
  try {
    const todoModelSaved = await TodoModel.save(req.body);
    return res.status(201).json(todoModelSaved);
  } catch (error) {
    console.error(error);
    console.error("erieriemr");
  }
};
