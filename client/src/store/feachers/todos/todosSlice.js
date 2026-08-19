import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:5000/api/tasks';

// Async Thunks to interact with Express + MongoDB backend

// 1. Fetch all tasks
export const fetchTasks = createAsyncThunk('todos/fetchTasks', async (_, { rejectWithValue }) => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.userId;
        if (!userId) {
            throw new Error('User not logged in');
        }
        const response = await fetch(`${API_URL}?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return await response.json();
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

// 2. Add a new task
export const addTaskAsync = createAsyncThunk('todos/addTaskAsync', async ({ title, category }, { rejectWithValue }) => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.userId;
        if (!userId) {
            throw new Error('User not logged in');
        }
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, category, userId })
        });
        if (!response.ok) throw new Error('Failed to add task');
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
        if (!response.ok) throw new Error('Failed to toggle task');
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
        if (!response.ok) throw new Error('Failed to update task');
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
        if (!response.ok) throw new Error('Failed to delete task');
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
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.tasks = action.payload.map(task => ({
                    id: task._id, // Map MongoDB's _id to frontend's id
                    title: task.title,
                    category: task.category,
                    completed: task.completed,
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
                    id: task._id,
                    title: task.title,
                    category: task.category,
                    completed: task.completed,
                    createdAt: task.createdAt
                });
            })
            // Toggle task
            .addCase(toggleTaskAsync.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const existingTask = state.tasks.find(t => t.id === updatedTask._id);
                if (existingTask) {
                    existingTask.completed = updatedTask.completed;
                }
            })
            // Update task
            .addCase(updateTaskAsync.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                const existingTask = state.tasks.find(t => t.id === updatedTask._id);
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
