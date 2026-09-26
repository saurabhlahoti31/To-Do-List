import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTaskAsync } from '../../store/feachers/todos/todosSlice';

export const TaskInput = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Work');
    const [priorityName, setPriorityName] = useState('Medium');
    const dispatch = useDispatch();

    const priorities = useSelector(state => state.priorities.items);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        // Find selected priority ID if available
        const selectedPriority = priorities.find(p => p.priorityName?.toLowerCase() === priorityName.toLowerCase());
        const validId = selectedPriority?._id && !selectedPriority._id.includes('fallback')
            ? selectedPriority._id
            : priorityName;

        dispatch(addTaskAsync({
            title: title.trim(),
            category,
            priorityId: validId,
            priority: validId,
            priorityName
        }));

        setTitle('');
    };


    return (
        <form className="task-input-form animate-slide-down" onSubmit={handleSubmit} style={{ animationDelay: '0.1s' }}>
            <input
                type="text"
                className="task-input"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <select
                className="priority-select"
                value={priorityName}
                onChange={(e) => setPriorityName(e.target.value)}
                title="Select Task Priority"
            >
                <option value="High">🔴 High</option>
                <option value="Medium">🟠 Medium</option>
                <option value="Low">🟢 Low</option>
            </select>
            <select
                className="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                title="Select Task Category"
            >
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Design">Design</option>
                <option value="Other">Other</option>
            </select>
            <button type="submit" className="add-btn">Add</button>
        </form>
    );
};

