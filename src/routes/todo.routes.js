// src/routes/todo.routes.js

const express = require('express');
const router = express.Router();

const { createTodo,getAllTodos,getTodoById,updateTodo,deleteTodo} = require('../controllers/todo.controller');

// insert todo route
router.post('/todos', createTodo);

// get all todo route
router.get('/todos', getAllTodos);

// Get todo by id
router.get('/todos/:id', getTodoById);

//Update todo by id
router.put('/todos/:id', updateTodo);

//Delete todo by id
router.delete('/todos/:id', deleteTodo);

module.exports = router;