import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../../config/api';

const API_URL = `${API_BASE_URL}/api/tasks`;

const getUserFromStorage = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        return null;
    }
};

// Async Thunks to interact with Express + MongoDB backend

// 1. Fetch all tasks
export const fetchTasks = createAsyncThunk('todos/fetchTasks', async (_, { rejectWithValue }) => {
    try {
        const user = getUserFromStorage();
        const userId = user?.userId;
        if (!userId) {
            throw new Error('User not logged in');
        }
        const response = await fetch(`${API_URL}?userId=${userId}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch tasks');
        }
        return await response.json();
    } catch (err) {
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            return rejectWithValue('Server is spinning up or unreachable. Please try again.');
        }
        return rejectWithValue(err.message);
    }
});

// 2. Add a new task
export const addTaskAsync = createAsyncThunk('todos/addTaskAsync', async ({ title, category, priorityId, priority, description, dueDate }, { rejectWithValue }) => {
    try {
        const user = getUserFromStorage();
        const userId = user?.userId;
        if (!userId) {
            throw new Error('User not logged in');
        }
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                category: category || 'Work',
                priorityId: priorityId || priority,
                priority: priority || priorityId,
                description: description || '',
                dueDate: dueDate || null,
                userId
            })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to add task');
        }
        return await response.json();
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

// 3. Toggle task completion status
export const toggleTaskAsync = createAsyncThunk('todos/toggleTaskAsync', async (task, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !task.completed })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to toggle task');
        }
        return await response.json();
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

// 4. Update task (title, priority, category, etc.)
export const updateTaskAsync = createAsyncThunk('todos/updateTaskAsync', async ({ id, title, category, priorityId, priority, completed, description, dueDate }, { rejectWithValue }) => {
    try {
        const payload = {};
        if (title !== undefined) payload.title = title;
        if (category !== undefined) payload.category = category;
        if (priorityId !== undefined || priority !== undefined) payload.priorityId = priorityId || priority;
        if (completed !== undefined) payload.completed = completed;
        if (description !== undefined) payload.description = description;
        if (dueDate !== undefined) payload.dueDate = dueDate;

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to update task');
        }
        return await response.json();
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

// 5. Delete a task
export const deleteTaskAsync = createAsyncThunk('todos/deleteTaskAsync', async (id, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to delete task');
        }
        return id;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

const PRIORITY_DEFAULTS = {
    High: { priorityName: 'High', description: 'Task needs immediate attention', order: 1, color: '#ef4444' },
    Medium: { priorityName: 'Medium', description: 'Task should be completed soon', order: 2, color: '#f59e0b' },
    Low: { priorityName: 'Low', description: 'Task can be completed later', order: 3, color: '#10b981' }
};

const normalizeTask = (task) => {
    let priorityObj = null;

    if (task.priority && typeof task.priority === 'object' && task.priority.priorityName) {
        priorityObj = task.priority;
    } else {
        const rawPriority = String(task.priorityName || task.priority || '');
        if (/high/i.test(rawPriority)) {
            priorityObj = { _id: task.priority || 'high-fallback', ...PRIORITY_DEFAULTS.High };
        } else if (/low/i.test(rawPriority)) {
            priorityObj = { _id: task.priority || 'low-fallback', ...PRIORITY_DEFAULTS.Low };
        } else if (/med/i.test(rawPriority)) {
            priorityObj = { _id: task.priority || 'medium-fallback', ...PRIORITY_DEFAULTS.Medium };
        }
    }

    if (!priorityObj) {
        priorityObj = { _id: task.priority || 'medium-fallback', ...PRIORITY_DEFAULTS.Medium };
    }

    const priorityName = priorityObj.priorityName || 'Medium';

    return {
        id: task._id || task.id,
        title: task.title,
        category: task.category || 'Other',
        completed: Boolean(task.completed),
        priority: priorityObj,
        priorityId: priorityObj._id || task.priority,
        priorityName: priorityName,
        description: task.description || '',
        dueDate: task.dueDate || null,
        createdAt: task.createdAt
    };
};


const initialState = {
    tasks: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    filter: 'All', // 'All' | 'Active' | 'Completed'
    priorityFilter: 'All', // 'All' | 'High' | 'Medium' | 'Low'
    sortBy: 'default' // 'default' | 'priority-high-low' | 'priority-low-high' | 'date-newest' | 'date-oldest'
};

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
        setPriorityFilter: (state, action) => {
            state.priorityFilter = action.payload;
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.tasks = action.payload.map(normalizeTask);
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Add task
            .addCase(addTaskAsync.fulfilled, (state, action) => {
                const normalized = normalizeTask(action.payload);
                state.tasks.unshift(normalized);
            })
            // Toggle task
            .addCase(toggleTaskAsync.fulfilled, (state, action) => {
                const updatedTask = normalizeTask(action.payload);
                const existingTask = state.tasks.find(t => t.id === updatedTask.id);
                if (existingTask) {
                    existingTask.completed = updatedTask.completed;
                }
            })
            // Update task
            .addCase(updateTaskAsync.fulfilled, (state, action) => {
                const updatedTask = normalizeTask(action.payload);
                const index = state.tasks.findIndex(t => t.id === updatedTask.id);
                if (index !== -1) {
                    state.tasks[index] = updatedTask;
                }
            })
            // Delete task
            .addCase(deleteTaskAsync.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(t => t.id !== action.payload);
            });
    }
});

export const { setFilter, setPriorityFilter, setSortBy } = todosSlice.actions;

export default todosSlice.reducer;

