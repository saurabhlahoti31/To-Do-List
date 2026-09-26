import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TaskItem } from './TaskItem';
import { fetchTasks } from '../../store/feachers/todos/todosSlice';

export const TaskList = () => {
    const dispatch = useDispatch();
    const { tasks, filter, priorityFilter, sortBy, status, error } = useSelector(state => state.todos);

    if (status === 'loading') {
        return (
            <div className="empty-state animate-fade-in" style={{ padding: '2rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', display: 'inline-block' }}>⏳</div>
                <p>Loading your tasks...</p>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="empty-state animate-fade-in" style={{ padding: '2rem 1rem' }}>
                <div style={{ fontSize: '2.5rem' }}>⚠️</div>
                <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error || 'Failed to load tasks'}</p>
                <button
                    className="add-btn"
                    onClick={() => dispatch(fetchTasks())}
                    style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}
                >
                    Retry Loading
                </button>
            </div>
        );
    }

    // 1. Filter by Status (All / Active / Completed) and Priority (All / High / Medium / Low)
    const filteredTasks = tasks.filter(task => {
        // Status filter
        if (filter === 'Active' && task.completed) return false;
        if (filter === 'Completed' && !task.completed) return false;

        // Priority filter
        if (priorityFilter && priorityFilter !== 'All') {
            const taskPriorityName = task.priority?.priorityName || task.priorityName || 'Medium';
            if (taskPriorityName.toLowerCase() !== priorityFilter.toLowerCase()) {
                return false;
            }
        }

        return true;
    });

    // 2. Sort tasks based on selected option
    const priorityOrderMap = { 'High': 1, 'Medium': 2, 'Low': 3 };

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'priority-high-low') {
            const orderA = a.priority?.order || priorityOrderMap[a.priority?.priorityName || a.priorityName] || 2;
            const orderB = b.priority?.order || priorityOrderMap[b.priority?.priorityName || b.priorityName] || 2;
            return orderA - orderB;
        }
        if (sortBy === 'priority-low-high') {
            const orderA = a.priority?.order || priorityOrderMap[a.priority?.priorityName || a.priorityName] || 2;
            const orderB = b.priority?.order || priorityOrderMap[b.priority?.priorityName || b.priorityName] || 2;
            return orderB - orderA;
        }
        // Default: keep existing order (createdAt desc)
        return 0;
    });

    if (sortedTasks.length === 0) {
        return (
            <div className="empty-state animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div style={{ fontSize: '3rem' }}>🍃</div>
                <p>
                    {priorityFilter !== 'All' || filter !== 'All'
                        ? 'No tasks match the selected filters.'
                        : 'No tasks found. Time to relax or add a new one!'}
                </p>
            </div>
        );
    }

    return (
        <div className="task-list animate-slide-down" style={{ animationDelay: '0.3s' }}>
            {sortedTasks.map(task => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
};

