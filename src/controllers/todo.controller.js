const db = require('../db');

let queueArr = [];
let queueIndex = 0;



// Insert To DO ----- POST /api/todos
const createTodo = async (req, res, next) => {
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


    const result = await db.query(query, values);

    queueService(result.rows[0]);
    // Return created todo
    return res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error creating todo:', error);
    next(error);
  }
};

const queueService = (result) => {
  queueArr.push(result);
  setTimeout(() => {
    // console.log('queue', queueArr, queueIndex);
    console.log('Print after 10 seconds-----------', queueArr[queueIndex]);
    queueIndex++;
  }, 10000);
};


// Get all To do --------
const getAllTodos = async (req, res, next) => {
  try {
    const { status, priority } = req.query;

    let query = `SELECT * FROM todos`;
    let conditions = [];
    let values = [];

    // Filter by status
    if (status) {
      if (status === 'completed') {
        conditions.push(`is_completed = $${values.length + 1}`);
        values.push(true);
      } else if (status === 'pending') {
        conditions.push(`is_completed = $${values.length + 1}`);
        values.push(false);
      }
    }

    // Filter by priority
    if (priority) {
      conditions.push(`priority = $${values.length + 1}`);
      values.push(priority);
    }

    // Add WHERE if conditions exist
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    // Order by latest
    query += ` ORDER BY created_at DESC`;

    const result = await db.query(query, values);

    return res.status(200).json(result.rows);
  }
  catch (error) {

    console.error('Error get all todo:', error);
    next(error);

  }
}

// Get todo by id
const getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT * FROM todos
      WHERE id = $1
    `;

    const result = await db.query(query, [id]);

    // If not found
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Todo not found',
      });
    }

    //  Found
    return res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error('Error fetching todo by id:', error);
    next(error);
  }
};

//update todo by id
const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, priority, due_date, is_completed } = req.body;

    let fields = [];
    let values = [];

    // 🔹 Add only provided fields
    if (title !== undefined) {
      fields.push(`title = $${values.length + 1}`);
      values.push(title);
    }

    if (description !== undefined) {
      fields.push(`description = $${values.length + 1}`);
      values.push(description);
    }

    if (priority !== undefined) {
      fields.push(`priority = $${values.length + 1}`);
      values.push(priority);
    }

    if (due_date !== undefined) {
      fields.push(`due_date = $${values.length + 1}`);
      values.push(due_date);
    }

    if (is_completed !== undefined) {
      fields.push(`is_completed = $${values.length + 1}`);
      values.push(is_completed);
    }

    // Nothing to update
    if (fields.length === 0) {
      return res.status(400).json({
        error: 'No fields provided to update',
      });
    }

    // Always update timestamp
    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    // Add id as last parameter
    values.push(id);

    const query = `
      UPDATE todos
      SET ${fields.join(', ')}
      WHERE id = $${values.length}
      RETURNING *
    `;

    const result = await db.query(query, values);

    // Todo not found
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Todo not found',
      });
    }

    // Updated
    return res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error('Error updating todo:', error);
    next(error);
  }
};

//delete todo by id
const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = `
      DELETE FROM todossss
      WHERE id = $1
      RETURNING *
    `;

    const result = await db.query(query, [id]);

    // If not found
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Todo not found',
      });
    }

    // Success
    return res.status(200).json({
      message: 'Todo deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting todo:', error);
    next(error);
  }
};

module.exports = {
  createTodo, getAllTodos, getTodoById, updateTodo, deleteTodo
};