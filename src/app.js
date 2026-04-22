// const http = require('http');

// const server = http.createServer((req, res) => {
//     if (req.url === '/') {
//         res.write('Hello World');
//         res.end();
//     }
// }).listen(3000);

// console.log('Listening on port 3000');

// const express = require('express');
// const app = express();

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

// app.listen(3000);
// console.log('Listening on port 3000');

// src/app.js

require('dotenv').config();
const errorHandler = require('./middleware/errorHandler');

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: Date.now(),
  });
});

const todoRoutes = require('./routes/todo.routes');

// prefix all routes with /api
app.use('/api', todoRoutes);

app.use(errorHandler);

// Port from .env or default 3001
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});