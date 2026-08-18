import React from 'react';
import { useSelector } from 'react-redux';
import { TaskItem } from './TaskItem';

export const TaskList = () => {
    const { tasks, filter } = useSelector(state => state.todos);

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
