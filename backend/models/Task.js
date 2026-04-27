const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    minlength: [1, 'Title cannot be empty']
  },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  category: { type: String, default: 'General' },
  dueDate: { type: Date },
  completed: { 
    type: Boolean, 
    default: false 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

taskSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);
