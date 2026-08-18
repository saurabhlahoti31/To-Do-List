import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../store/feachers/todos/todosSlice';

export const TaskFilter = () => {
    const dispatch = useDispatch();
    const currentFilter = useSelector(state => state.todos.filter);

    const filters = ['All', 'Active', 'Completed'];

    return (
        <div className="filters animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {filters.map(filter => (
                <button
                    key={filter}
                    className={`filter-btn ${currentFilter === filter ? 'active' : ''}`}
                    onClick={() => dispatch(setFilter(filter))}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
};
