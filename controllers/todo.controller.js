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
  try {
    const updatedModel = await TodoModel.findByIdAndUpdate(
      req.params.todoId,
      req.body,
      { new: true, useFindAndModify: false }
    );
    if (updatedModel) {
      return res.status(200).json(updatedModel);
    }
    return res.status(404).json({ message: "Could not find id" });
  } catch (err) {
    next(err);
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
