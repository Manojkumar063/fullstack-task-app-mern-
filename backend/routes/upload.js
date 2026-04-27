const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/security');
const logger = require('../utils/logger');
const Task = require('../models/Task');
const { parseDocumentToTasks } = require('../services/documentParser');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'text/plain', 'image/png', 'image/jpeg', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

router.post('/parse', auth, uploadLimiter, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const tasks = await parseDocumentToTasks(req.file.buffer, req.file.mimetype);
    
    res.json({ tasks, count: tasks.length });
  } catch (error) {
    logger.error('Document parse error:', error);
    res.status(500).json({ message: 'Failed to parse document' });
  }
});

router.post('/parse-and-create', auth, uploadLimiter, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const tasks = await parseDocumentToTasks(req.file.buffer, req.file.mimetype);
    
    const createdTasks = await Task.insertMany(
      tasks.map(t => ({ ...t, userId: req.userId }))
    );

    res.json({ tasks: createdTasks, count: createdTasks.length });
  } catch (error) {
    logger.error('Document create error:', error);
    res.status(500).json({ message: 'Failed to create tasks from document' });
  }
});

module.exports = router;
