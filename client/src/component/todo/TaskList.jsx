import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TaskItem } from './TaskItem';
import { fetchTasks } from '../../store/feachers/todos/todosSlice';

export const TaskList = () => {
    const dispatch = useDispatch();
    const { tasks, filter, status, error } = useSelector(state => state.todos);

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

    const filteredTasks = tasks.filter(task => {
        if (filter === 'Active') return !task.completed;
        if (filter === 'Completed') return task.completed;
        return true; // 'All'
    });

    if (filteredTasks.length === 0) {
        return (
            <div className="empty-state animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div style={{ fontSize: '3rem' }}>🍃</div>
                <p>No tasks found. Time to relax or add a new one!</p>
            </div>
        );
    }

    return (
        <div className="task-list animate-slide-down" style={{ animationDelay: '0.3s' }}>
            {filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
};
