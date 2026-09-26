import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../../config/api';

const API_URL = `${API_BASE_URL}/api/priorities`;

// Default fallback priorities for resilience
export const DEFAULT_PRIORITIES = [
    { _id: 'high-fallback', priorityName: 'High', description: 'Task needs immediate attention', order: 1, color: '#ef4444' },
    { _id: 'medium-fallback', priorityName: 'Medium', description: 'Task should be completed soon', order: 2, color: '#f59e0b' },
    { _id: 'low-fallback', priorityName: 'Low', description: 'Task can be completed later', order: 3, color: '#10b981' }
];

// Async Thunks

// 1. Fetch all priorities
export const fetchPriorities = createAsyncThunk('priorities/fetchPriorities', async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to fetch priorities');
        }
        return await response.json();
    } catch (err) {
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
            return rejectWithValue('Server is spinning up or unreachable. Using fallback priorities.');
        }
        return rejectWithValue(err.message);
    }
});

// 2. Add a priority
export const addPriorityAsync = createAsyncThunk('priorities/addPriorityAsync', async (priorityData, { rejectWithValue }) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(priorityData)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to add priority');
        }
        return await response.json();
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

// 3. Update a priority
export const updatePriorityAsync = createAsyncThunk('priorities/updatePriorityAsync', async ({ id, ...priorityData }, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(priorityData)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to update priority');
        }
        return await response.json();
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

// 4. Delete a priority
export const deletePriorityAsync = createAsyncThunk('priorities/deletePriorityAsync', async (id, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to delete priority');
        }
        return id;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

const initialState = {
    items: DEFAULT_PRIORITIES,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

const prioritiesSlice = createSlice({
    name: 'priorities',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchPriorities.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPriorities.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                if (action.payload && action.payload.length > 0) {
                    state.items = action.payload;
                }
            })
            .addCase(fetchPriorities.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Add
            .addCase(addPriorityAsync.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Update
            .addCase(updatePriorityAsync.fulfilled, (state, action) => {
                const index = state.items.findIndex(p => (p._id || p.id) === (action.payload._id || action.payload.id));
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete
            .addCase(deletePriorityAsync.fulfilled, (state, action) => {
                state.items = state.items.filter(p => (p._id || p.id) !== action.payload);
            });
    }
});

export default prioritiesSlice.reducer;
