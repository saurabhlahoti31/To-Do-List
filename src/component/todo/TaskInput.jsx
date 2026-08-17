import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTaskAsync } from '../../store/feachers/todos/todosSlice';

export const TaskInput = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Work');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            dispatch(addTaskAsync({ title, category }));
            setTitle('');
        }
    };

    return (
        <form className="task-input-form animate-slide-down" onSubmit={handleSubmit} style={{ animationDelay: '0.1s' }}>
            <input
                type="text"
                className="task-input"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <select
                className="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
