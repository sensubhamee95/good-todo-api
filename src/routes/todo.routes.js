// src/routes/todo.routes.js

const express = require('express');
const router = express.Router();

const { createTodo } = require('../controllers/todo.controller');

// POST /api/todos
router.post('/todos', createTodo);

module.exports = router;