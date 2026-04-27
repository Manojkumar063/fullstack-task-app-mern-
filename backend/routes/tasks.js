const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');
const { validateTaskTitle } = require('../utils/validation');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
    res.json(tasks);
  } catch (error) {
    logger.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title } = req.body;
    
    const validation = validateTaskTitle(title);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.error });
    }
    
    const task = new Task({ 
      title: validation.value,
      userId: req.userId 
    });
    const savedTask = await task.save();
    
    logger.info(`Task created: ${savedTask._id}`);
    res.status(201).json(savedTask);
  } catch (error) {
    logger.error('Create task error:', error);
    res.status(400).json({ message: 'Invalid request' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    
    const { completed } = req.body;
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'Invalid completed value' });
    }
    
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { completed },
      { new: true, runValidators: true }
    );
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    res.json(task);
  } catch (error) {
    logger.error('Update task error:', error);
    res.status(400).json({ message: 'Invalid request' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    logger.info(`Task deleted: ${req.params.id}`);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    logger.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

module.exports = router;
