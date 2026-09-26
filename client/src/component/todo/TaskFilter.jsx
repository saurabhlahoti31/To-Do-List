import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, setPriorityFilter, setSortBy } from '../../store/feachers/todos/todosSlice';

export const TaskFilter = () => {
    const dispatch = useDispatch();
    const currentFilter = useSelector(state => state.todos.filter);
    const currentPriorityFilter = useSelector(state => state.todos.priorityFilter);
    const currentSortBy = useSelector(state => state.todos.sortBy);

    const statusFilters = ['All', 'Active', 'Completed'];

    return (
        <div className="filter-controls animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="filters">
                {statusFilters.map(filter => (
                    <button
                        key={filter}
                        className={`filter-btn ${currentFilter === filter ? 'active' : ''}`}
                        onClick={() => dispatch(setFilter(filter))}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="secondary-filters">
                {/* Priority Filter Dropdown */}
                <div className="dropdown-filter-wrapper">
                    <select
                        className="filter-select priority-filter-select"
                        value={currentPriorityFilter}
                        onChange={(e) => dispatch(setPriorityFilter(e.target.value))}
                        title="Filter tasks by Priority"
                        aria-label="Filter tasks by priority"
                    >
                        <option value="All">All Priorities</option>
                        <option value="High">🔴 High</option>
                        <option value="Medium">🟠 Medium</option>
                        <option value="Low">🟢 Low</option>
                    </select>
                </div>

                {/* Priority Sorting Dropdown */}
                <div className="dropdown-filter-wrapper">
                    <select
                        className="filter-select sort-select"
                        value={currentSortBy}
                        onChange={(e) => dispatch(setSortBy(e.target.value))}
                        title="Sort tasks by Priority or Date"
                        aria-label="Sort tasks"
                    >
                        <option value="default">Sort: Default</option>
                        <option value="priority-high-low">Sort: High → Low</option>
                        <option value="priority-low-high">Sort: Low → High</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

