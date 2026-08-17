import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTaskAsync, deleteTaskAsync, updateTaskAsync } from '../../store/feachers/todos/todosSlice';

export const TaskItem = ({ task }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);

    const handleSave = () => {
        if (newTitle.trim()) {
            dispatch(updateTaskAsync({ id: task.id, title: newTitle }));
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setNewTitle(task.title);
        }
    };

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-left">
                <input
                    type="checkbox"
                    role="button"
                    className="checkbox"
                    checked={task.completed}
                    onChange={() => dispatch(toggleTaskAsync(task))}
                    disabled={isEditing}
                    aria-label={`Mark task ${task.title} as completed`}
                />
                {isEditing ? (
                    <input
                        type="text"
                        className="task-edit-input"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                ) : (
                    <span className="task-title">{task.title}</span>
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge badge-${task.category.toLowerCase()}`}>
                    {task.category}
                </span>
                {isEditing ? (
                    <>
                        <button
                            className="edit-btn"
                            onClick={handleSave}
                            title="Save Task"
                        >
                            Save
                        </button>
                        <button
                            className="cancel-btn"
                            onClick={() => {
                                setIsEditing(false);
                                setNewTitle(task.title);
                            }}
                            title="Cancel"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    !task.completed && (
                        <button
                            className="edit-btn"
                            onClick={() => setIsEditing(true)}
                            title="Edit Task"
                        >
                            📝
                        </button>
                    )
                )}
                <button
                    className="delete-btn"
                    onClick={() => dispatch(deleteTaskAsync(task.id))}
                    title="Delete Task"
                >
                    🗑️
                </button>
            </div>
        </div>
    );
};
