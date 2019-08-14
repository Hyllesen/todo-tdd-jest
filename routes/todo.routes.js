const express = require("express");
const todoController = require("../controllers/todo.controller");
const router = express.Router();

router.post("/", todoController.addTodo);

router.get("/", todoController.getTodos);

module.exports = router;
