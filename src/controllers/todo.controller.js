// src/controllers/todo.controller.js

const db = require('../db');

// POST /api/todos
const createTodo = async (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        error: 'Title is required',
      });
    }

    // Insert query (parameterized)
    const query = `
      INSERT INTO todos (title, description, priority, due_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [title, description, priority, due_date];

    console.log(query, values);


    const result = await db.query(query, values);
    console.log('result **********',result);


    // Return created todo
    return res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error creating todo:', error);

    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
};

module.exports = {
  createTodo,
};