import express from 'express';
import Todo from '../models/Todo.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all todos for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a todo
router.post('/', auth, async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    user: req.user.id,
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a todo
router.patch('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    if (req.body.title != null) {
      todo.title = req.body.title;
    }
    if (req.body.completed != null) {
      todo.completed = req.body.completed;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    await todo.deleteOne();
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
