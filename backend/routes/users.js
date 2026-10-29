const express = require('express');
const router = express.Router();
const { run, all, get } = require('../db');

// GET /api/users — retrieve all users
router.get('/', async (req, res) => {
  try {
    const users = await all(
      'SELECT id, name, email, age, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:id — retrieve a single user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await get(
      'SELECT id, name, email, age, created_at, updated_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users — create a new user
router.post('/', async (req, res) => {
  const { name, email, age } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  try {
    const result = await run(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name, email, age || null]
    );
    // Fetch the newly created user
    const newUser = await get(
      'SELECT id, name, email, age, created_at, updated_at FROM users WHERE id = ?',
      [result.id]
    );
    res.status(201).json(newUser);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// PUT /api/users/:id — update an existing user
router.put('/:id', async (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email are required' });
  }

  try {
    const result = await run(
      'UPDATE users SET name = ?, email = ?, age = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, email, age || null, req.params.id]
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const updatedUser = await get(
      'SELECT id, name, email, age, created_at, updated_at FROM users WHERE id = ?',
      [req.params.id]
    );
    res.json(updatedUser);
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// DELETE /api/users/:id — delete a user
router.delete('/:id', async (req, res) => {
  try {
    const result = await run(
      'DELETE FROM users WHERE id = ?',
      [req.params.id]
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
