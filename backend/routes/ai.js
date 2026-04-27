const express = require('express');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');
const Chat = require('../models/Chat');
const Task = require('../models/Task');
const { 
  generateTaskSuggestions, 
  generateTaskDescription, 
  breakdownTask, 
  predictPriority, 
  chat,
  analyzeTaskContext,
  generateSmartReminder,
  categorizeTask,
  estimateTaskTime,
  generateTaskFromVoice,
  smartSearch
} = require('../services/aiService');

const router = express.Router();

router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    let chatDoc = await Chat.findOne({ userId: req.userId });
    
    if (!chatDoc) {
      chatDoc = new Chat({ userId: req.userId, messages: [] });
    }

    chatDoc.messages.push({ role: 'user', content: message });
    
    const conversationHistory = chatDoc.messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));

    const response = await chat(message, conversationHistory);
    
    chatDoc.messages.push({ role: 'assistant', content: response });
    await chatDoc.save();

    res.json({ response, history: chatDoc.messages.slice(-20) });
  } catch (error) {
    logger.error('Chat error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
});

router.get('/chat/history', auth, async (req, res) => {
  try {
    const chatDoc = await Chat.findOne({ userId: req.userId });
    res.json({ messages: chatDoc?.messages || [] });
  } catch (error) {
    logger.error('Chat history error:', error);
    res.status(500).json({ message: 'Failed to load history' });
  }
});

router.delete('/chat/history', auth, async (req, res) => {
  try {
    await Chat.findOneAndDelete({ userId: req.userId });
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    logger.error('Clear history error:', error);
    res.status(500).json({ message: 'Failed to clear history' });
  }
});

router.post('/suggestions', auth, async (req, res) => {
  try {
    const { context } = req.body;
    const suggestions = await generateTaskSuggestions(context || 'daily tasks');
    res.json({ suggestions: suggestions.split('\n').filter(s => s.trim()) });
  } catch (error) {
    logger.error('AI suggestions error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
});

router.post('/description', auth, async (req, res) => {
  try {
    const { title } = req.body;
    const description = await generateTaskDescription(title);
    res.json({ description });
  } catch (error) {
    logger.error('AI description error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
});

router.post('/breakdown', auth, async (req, res) => {
  try {
    const { task } = req.body;
    const subtasks = await breakdownTask(task);
    res.json({ subtasks: subtasks.split('\n').filter(s => s.trim()) });
  } catch (error) {
    logger.error('AI breakdown error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
});

router.post('/priority', auth, async (req, res) => {
  try {
    const { title } = req.body;
    const priority = await predictPriority(title);
    res.json({ priority: priority.trim() });
  } catch (error) {
    logger.error('AI priority error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
});

router.post('/analyze', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).lean();
    const analysis = await analyzeTaskContext(tasks);
    res.json({ analysis });
  } catch (error) {
    logger.error('AI analyze error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
});

router.post('/reminder', auth, async (req, res) => {
  try {
    const { task } = req.body;
    const reminder = await generateSmartReminder(task);
    res.json({ reminder });
  } catch (error) {
    logger.error('AI reminder error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
});

router.post('/categorize', auth, async (req, res) => {
  try {
    const { title } = req.body;
    const category = await categorizeTask(title);
    res.json({ category: category.trim() });
  } catch (error) {
    logger.error('AI categorize error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
});

router.post('/estimate-time', auth, async (req, res) => {
  try {
    const { title } = req.body;
    const time = await estimateTaskTime(title);
    res.json({ estimatedMinutes: parseInt(time) || 30 });
  } catch (error) {
    logger.error('AI estimate error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
});

router.post('/voice-to-task', auth, async (req, res) => {
  try {
    const { voiceText } = req.body;
    const taskData = await generateTaskFromVoice(voiceText);
    res.json({ task: JSON.parse(taskData) });
  } catch (error) {
    logger.error('AI voice error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
});

router.post('/smart-search', auth, async (req, res) => {
  try {
    const { query } = req.body;
    const tasks = await Task.find({ userId: req.userId }).lean();
    const results = await smartSearch(query, tasks);
    res.json({ results });
  } catch (error) {
    logger.error('AI search error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
});

module.exports = router;
