const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRouter);

// Root route — simple health check
app.get('/', (req, res) => {
  res.json({ message: 'Vue SQLite Test List API', status: 'running' });
});

// Start server (db.js is loaded as a side-effect via require inside usersRouter)
require('./db');

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
