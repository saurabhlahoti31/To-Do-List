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
export const addTaskAsync = createAsyncThunk('todos/addTaskAsync', async ({ title, category }, { rejectWithValue }) => {
    try {
        const user = getUserFromStorage();
        const userId = user?.userId;
        if (!userId) {
            throw new Error('User not logged in');
        }
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, category, userId })
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

// 4. Update task title
export const updateTaskAsync = createAsyncThunk('todos/updateTaskAsync', async ({ id, title }, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
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

const initialState = {
    tasks: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    filter: 'All'
};

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filter = action.payload;
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
                state.tasks = action.payload.map(task => ({
                    id: task._id || task.id,
                    title: task.title,
                    category: task.category || 'Other',
                    completed: Boolean(task.completed),
                    createdAt: task.createdAt
                }));
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Add task
            .addCase(addTaskAsync.fulfilled, (state, action) => {
                const task = action.payload;
                state.tasks.unshift({
                    id: task._id || task.id,
                    title: task.title,
                    category: task.category || 'Other',
                    completed: Boolean(task.completed),
                    createdAt: task.createdAt
                });
            })
            // Toggle task
            .addCase(toggleTaskAsync.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const targetId = updatedTask._id || updatedTask.id;
                const existingTask = state.tasks.find(t => t.id === targetId);
                if (existingTask) {
                    existingTask.completed = Boolean(updatedTask.completed);
                }
            })
            // Update task
            .addCase(updateTaskAsync.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const targetId = updatedTask._id || updatedTask.id;
                const existingTask = state.tasks.find(t => t.id === targetId);
                if (existingTask) {
                    existingTask.title = updatedTask.title;
                }
            })
            // Delete task
            .addCase(deleteTaskAsync.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(t => t.id !== action.payload);
            });
    }
});

export const { setFilter } = todosSlice.actions;

export default todosSlice.reducer;
