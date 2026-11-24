const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection string
const mongoURI = process.env.MONGODB_URI;

// Priority Schema & Model
const PrioritySchema = new mongoose.Schema({
  priorityName: {
    type: String,
    required: [true, 'Priority name is required'],
    trim: true,
    enum: ['High', 'Medium', 'Low']
  },
  description: {
    type: String,
    required: [true, 'Priority description is required'],
    trim: true
  },
  order: {
    type: Number,
    required: true,
    default: 2
  },
  color: {
    type: String,
    default: '#f59e0b'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure priorityName is unique
PrioritySchema.index({ priorityName: 1 }, { unique: true });

const Priority = mongoose.model('Priority', PrioritySchema);

// Task Schema & Model
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  dueDate: {
    type: Date,
    default: null
  },
  // Calendar deadline stored as Date (UTC noon) so the day does not shift across timezones.
  category: {
    type: String,
    default: 'Other'
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Priority',
    required: [true, 'Priority is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', TaskSchema);

// User Schema & Model
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

// Auto Seed Default Priorities
const DEFAULT_PRIORITIES = [
  {
    priorityName: 'High',
    description: 'Task needs immediate attention',
    order: 1,
    color: '#ef4444'
  },
  {
    priorityName: 'Medium',
    description: 'Task should be completed soon',
    order: 2,
    color: '#f59e0b'
  },
  {
    priorityName: 'Low',
    description: 'Task can be completed later',
    order: 3,
    color: '#10b981'
  }
];

async function seedPriorities() {
  try {
    for (const p of DEFAULT_PRIORITIES) {
      await Priority.findOneAndUpdate(
        { priorityName: p.priorityName },
        { $setOnInsert: p },
        { upsert: true, new: true }
      );
    }
    console.log('Default priorities checked/seeded successfully.');
  } catch (err) {
    console.error('Error seeding default priorities:', err.message);
  }
}

// Connect to MongoDB and seed priorities
mongoose.connect(mongoURI)
  .then(async () => {
    console.log('MongoDB Connected successfully!');
    await seedPriorities();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Auth Routes

// 1. Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Login user
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }
    
    // Note: For simplicity, comparing plain text passwords
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    res.json({ message: 'Login successful', userId: user._id, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Priority Routes

// 1. Get all priorities
app.get('/api/priorities', async (req, res) => {
  try {
    const priorities = await Priority.find().sort({ order: 1 });
    res.json(priorities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get priority by ID
app.get('/api/priorities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Priority ID format' });
    }
    const priority = await Priority.findById(id);
    if (!priority) {
      return res.status(404).json({ error: 'Priority not found' });
    }
    res.json(priority);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Create a priority
app.post('/api/priorities', async (req, res) => {
  try {
    const { priorityName, description, order, color } = req.body;
    if (!priorityName || !priorityName.trim()) {
      return res.status(400).json({ error: 'Priority name is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Priority description is required' });
    }

    const trimmedName = priorityName.trim();
    const existing = await Priority.findOne({
      priorityName: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
    });
    if (existing) {
      return res.status(400).json({ error: 'Priority with this name already exists' });
    }

    const newPriority = new Priority({
      priorityName: trimmedName,
      description: description.trim(),
      order: order !== undefined ? Number(order) : 2,
      color: color || '#f59e0b'
    });

    const saved = await newPriority.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update a priority
app.put('/api/priorities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Priority ID format' });
    }

    const { priorityName, description, order, color } = req.body;
    if (priorityName) {
      const trimmedName = priorityName.trim();
      const duplicate = await Priority.findOne({
        _id: { $ne: id },
        priorityName: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
      });
      if (duplicate) {
        return res.status(400).json({ error: 'Priority with this name already exists' });
      }
    }

    const updateFields = {};
    if (priorityName) updateFields.priorityName = priorityName.trim();
    if (description) updateFields.description = description.trim();
    if (order !== undefined) updateFields.order = Number(order);
    if (color) updateFields.color = color;

    const updated = await Priority.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Priority not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Delete a priority
app.delete('/api/priorities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Priority ID format' });
    }

    // Check if any task is assigned to this priority
    const associatedTasksCount = await Task.countDocuments({ priority: id });
    if (associatedTasksCount > 0) {
      return res.status(400).json({
        error: `Cannot delete priority. It is currently assigned to ${associatedTasksCount} task(s).`
      });
    }

    const deleted = await Priority.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Priority not found' });
    }
    res.json({ message: 'Priority deleted successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper to validate and resolve priorityId
async function resolvePriority(priorityInput) {
  if (!priorityInput) return null;

  // If priorityInput is an object e.g. { _id, priorityName }
  if (typeof priorityInput === 'object') {
    if (priorityInput._id && mongoose.Types.ObjectId.isValid(priorityInput._id) && /^[0-9a-fA-F]{24}$/.test(String(priorityInput._id))) {
      const priority = await Priority.findById(priorityInput._id);
      if (priority) return priority;
    }
    if (priorityInput.priorityName) {
      const priority = await Priority.findOne({
        priorityName: { $regex: new RegExp(`^${priorityInput.priorityName.trim()}$`, 'i') }
      });
      if (priority) return priority;
    }
  }

  const inputStr = String(priorityInput).trim();

  // Check if it is a valid 24-char hex ObjectId
  if (mongoose.Types.ObjectId.isValid(inputStr) && /^[0-9a-fA-F]{24}$/.test(inputStr)) {
    const priority = await Priority.findById(inputStr);
    if (priority) return priority;
  }

  // Check direct name e.g. "High", "Medium", "Low"
  let priority = await Priority.findOne({
    priorityName: { $regex: new RegExp(`^${inputStr}$`, 'i') }
  });
  if (priority) return priority;

  // Check if string contains high, medium, or low (e.g. "high-fallback", "priority-high")
  if (/high/i.test(inputStr)) {
    priority = await Priority.findOne({ priorityName: 'High' });
    if (priority) return priority;
  }
  if (/med/i.test(inputStr)) {
    priority = await Priority.findOne({ priorityName: 'Medium' });
    if (priority) return priority;
  }
  if (/low/i.test(inputStr)) {
    priority = await Priority.findOne({ priorityName: 'Low' });
    if (priority) return priority;
  }

  return null;
}

function padDatePart(value) {
  return String(value).padStart(2, '0');
}

function getTodayYmd() {
  const now = new Date();
  return `${now.getFullYear()}-${padDatePart(now.getMonth() + 1)}-${padDatePart(now.getDate())}`;
}

function parseDueDateInput(input) {
  if (input === undefined || input === null || String(input).trim() === '') {
    return { error: 'Due Date is required' };
  }

  const raw = input instanceof Date ? input.toISOString() : String(input).trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);

  let year;
  let month;
  let day;

  if (match) {
    year = Number(match[1]);
    month = Number(match[2]);
    day = Number(match[3]);
  } else {
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
      return { error: 'Due Date must be a valid date' };
    }
    year = parsed.getUTCFullYear();
    month = parsed.getUTCMonth() + 1;
    day = parsed.getUTCDate();
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return { error: 'Due Date is not a valid date' };
  }

  const utcDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    return { error: 'Due Date is not a valid calendar date' };
  }

  const ymd = `${year}-${padDatePart(month)}-${padDatePart(day)}`;
  return { value: utcDate, ymd };
}

function isBeforeToday(ymd) {
  return ymd < getTodayYmd();
}

function getTaskDueStatus(task) {
  if (task.completed) return 'completed';
  if (!task.dueDate) return 'none';
  const parsed = parseDueDateInput(task.dueDate);
  if (parsed.error) return 'none';
  const today = getTodayYmd();
  if (parsed.ymd === today) return 'today';
  if (parsed.ymd > today) return 'upcoming';
  return 'overdue';
}


// CRUD Routes for Tasks

// 1. Get all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const { userId, priorityId, priorityName, sort, dueStatus } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const filter = { userId };

    if (priorityId && mongoose.Types.ObjectId.isValid(priorityId)) {
      filter.priority = priorityId;
    } else if (priorityName) {
      const priorityDoc = await Priority.findOne({
        priorityName: { $regex: new RegExp(`^${priorityName.trim()}$`, 'i') }
      });
      if (priorityDoc) {
        filter.priority = priorityDoc._id;
      }
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'priority') {
      // We will sort in JS or populate
    }

    let tasks = await Task.find(filter)
      .populate('priority')
      .sort(sortOptions);

    // Fallback for legacy tasks created before priority was added
    const defaultPriority = await Priority.findOne({ priorityName: 'Medium' }) || await Priority.findOne();
    tasks = tasks.map(task => {
      const obj = task.toObject();
      if (!obj.priority && defaultPriority) {
        obj.priority = defaultPriority;
      }
      return obj;
    });

    if (dueStatus && dueStatus !== 'all') {
      tasks = tasks.filter((task) => getTaskDueStatus(task) === dueStatus);
    }

    if (sort === 'priority-high-to-low') {
      tasks.sort((a, b) => (a.priority?.order || 99) - (b.priority?.order || 99));
    } else if (sort === 'priority-low-to-high') {
      tasks.sort((a, b) => (b.priority?.order || 0) - (a.priority?.order || 0));
    } else if (sort === 'due-earliest') {
      tasks.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (sort === 'due-latest') {
      tasks.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate) - new Date(a.dueDate);
      });
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Create a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, category, completed, userId, priorityId, priority, description, dueDate } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    const priorityInput = priorityId || priority;
    if (!priorityInput) {
      return res.status(400).json({ error: 'Priority is required when creating a task' });
    }

    const resolvedPriority = await resolvePriority(priorityInput);
    if (!resolvedPriority) {
      return res.status(400).json({ error: 'Invalid Priority ID or Priority Name. Priority does not exist.' });
    }

    const parsedDueDate = parseDueDateInput(dueDate);
    if (parsedDueDate.error) {
      return res.status(400).json({ error: parsedDueDate.error });
    }
    if (isBeforeToday(parsedDueDate.ymd)) {
      return res.status(400).json({ error: 'Due Date cannot be earlier than today' });
    }

    const newTask = new Task({
      title: title.trim(),
      category: category || 'Other',
      completed: Boolean(completed),
      priority: resolvedPriority._id,
      description: description ? description.trim() : '',
      dueDate: parsedDueDate.value,
      userId
    });

    const savedTask = await newTask.save();
    const populatedTask = await Task.findById(savedTask._id).populate('priority');
    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Update a task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }

    const updateFields = {};
    if (req.body.title !== undefined) updateFields.title = req.body.title.trim();
    if (req.body.completed !== undefined) updateFields.completed = Boolean(req.body.completed);
    if (req.body.category !== undefined) updateFields.category = req.body.category;
    if (req.body.description !== undefined) updateFields.description = req.body.description.trim();
    if (req.body.dueDate !== undefined) updateFields.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;

    const priorityInput = req.body.priorityId || req.body.priority;
    if (priorityInput !== undefined) {
      const resolvedPriority = await resolvePriority(priorityInput);
      if (!resolvedPriority) {
        return res.status(400).json({ error: 'Invalid Priority ID or Priority Name. Priority does not exist.' });
      }
      updateFields.priority = resolvedPriority._id;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    ).populate('priority');

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

