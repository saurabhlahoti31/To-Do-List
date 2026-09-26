import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPriorityFilter } from '../../store/feachers/todos/todosSlice';

export const PriorityDashboard = () => {
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.todos.tasks);
    const activePriorityFilter = useSelector(state => state.todos.priorityFilter);

    // Calculate priority statistics
    const highCount = tasks.filter(t => (t.priority?.priorityName === 'High' || t.priorityName === 'High')).length;
    const mediumCount = tasks.filter(t => (t.priority?.priorityName === 'Medium' || t.priorityName === 'Medium')).length;
    const lowCount = tasks.filter(t => (t.priority?.priorityName === 'Low' || t.priorityName === 'Low')).length;
    const totalCount = tasks.length;

    const cards = [
        {
            name: 'High',
            label: 'High Priority',
            count: highCount,
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.12)',
            border: 'rgba(239, 68, 68, 0.3)',
            icon: '🔴'
        },
        {
            name: 'Medium',
            label: 'Medium Priority',
            count: mediumCount,
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.12)',
            border: 'rgba(245, 158, 11, 0.3)',
            icon: '🟠'
        },
        {
            name: 'Low',
            label: 'Low Priority',
            count: lowCount,
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.12)',
            border: 'rgba(16, 185, 129, 0.3)',
            icon: '🟢'
        }
    ];

    const handleFilterClick = (priorityName) => {
        if (activePriorityFilter === priorityName) {
            dispatch(setPriorityFilter('All'));
        } else {
            dispatch(setPriorityFilter(priorityName));
        }
    };

    return (
        <div className="priority-dashboard animate-slide-down" style={{ animationDelay: '0.05s' }}>
            <div className="dashboard-grid">
                {cards.map(card => {
                    const isSelected = activePriorityFilter === card.name;
                    return (
                        <div
                            key={card.name}
                            className={`dashboard-card ${isSelected ? 'active' : ''}`}
                            style={{
                                background: card.bg,
                                borderColor: isSelected ? card.color : card.border
                            }}
                            onClick={() => handleFilterClick(card.name)}
                            title={`Filter by ${card.name} Priority (Click again to reset)`}
                        >
                            <div className="dashboard-card-top">
                                <span className="dashboard-card-icon">{card.icon}</span>
                                <span className="dashboard-card-count" style={{ color: card.color }}>
                                    {card.count}
                                </span>
                            </div>
                            <div className="dashboard-card-label">{card.name}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
