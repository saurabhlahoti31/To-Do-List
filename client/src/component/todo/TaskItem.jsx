import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTaskAsync, deleteTaskAsync, updateTaskAsync } from '../../store/feachers/todos/todosSlice';

export const TaskItem = ({ task }) => {
    const dispatch = useDispatch();
    const priorities = useSelector(state => state.priorities.items);

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editCategory, setEditCategory] = useState(task.category || 'Other');
    
    // Priority resolution
    const currentPriorityName = task.priority?.priorityName || task.priorityName || 'Medium';
    const [editPriorityName, setEditPriorityName] = useState(currentPriorityName);

    const handleSave = () => {
        if (!editTitle.trim()) return;

        const selectedPriority = priorities.find(p => p.priorityName === editPriorityName);
        const priorityId = selectedPriority?._id || editPriorityName;

        dispatch(updateTaskAsync({
            id: task.id,
            title: editTitle.trim(),
            category: editCategory,
            priorityId: priorityId,
            priority: priorityId
        }));
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditTitle(task.title);
        setEditCategory(task.category || 'Other');
        setEditPriorityName(task.priority?.priorityName || task.priorityName || 'Medium');
    };

    const priorityName = task.priority?.priorityName || task.priorityName || 'Medium';
    const priorityDesc = task.priority?.description || '';
    const categoryName = task.category || 'Other';

    const getPriorityIcon = (name) => {
        switch (name) {
            case 'High': return '🔴';
            case 'Medium': return '🟠';
            case 'Low': return '🟢';
            default: return '⚪';
        }
    };

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''} animate-fade-in`}>
            <div className="task-left">
                <input
                    type="checkbox"
                    role="button"
                    className="checkbox"
                    checked={Boolean(task.completed)}
                    onChange={() => dispatch(toggleTaskAsync(task))}
                    disabled={isEditing}
                    aria-label={`Mark task ${task.title} as completed`}
                />

                {isEditing ? (
                    <div className="task-edit-controls">
                        <input
                            type="text"
                            className="task-edit-input"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            placeholder="Task title"
                        />
                        <div className="task-edit-selects">
                            <select
                                className="edit-select priority-edit-select"
                                value={editPriorityName}
                                onChange={(e) => setEditPriorityName(e.target.value)}
                                title="Edit Priority"
                            >
                                <option value="High">🔴 High</option>
                                <option value="Medium">🟠 Medium</option>
                                <option value="Low">🟢 Low</option>
                            </select>
                            <select
                                className="edit-select category-edit-select"
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                title="Edit Category"
                            >
                                <option value="Work">Work</option>
                                <option value="Study">Study</option>
                                <option value="Design">Design</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                ) : (
                    <div className="task-content">
                        <span className="task-title">{task.title}</span>
                    </div>
                )}
            </div>

            <div className="task-right">
                {!isEditing && (
                    <div className="task-badges">
                        {/* Priority Badge */}
                        <span
                            className={`badge badge-priority badge-priority-${priorityName.toLowerCase()}`}
                            title={priorityDesc || `Priority: ${priorityName}`}
                        >
                            <span className="priority-dot">{getPriorityIcon(priorityName)}</span>
                            {priorityName}
                        </span>

                        {/* Category Badge */}
                        <span className={`badge badge-${categoryName.toLowerCase()}`}>
                            {categoryName}
                        </span>
                    </div>
                )}

                <div className="task-actions">
                    {isEditing ? (
                        <>
                            <button
                                className="edit-btn save-action-btn"
                                onClick={handleSave}
                                title="Save Task"
                            >
                                Save
                            </button>
                            <button
                                className="cancel-btn cancel-action-btn"
                                onClick={handleCancel}
                                title="Cancel"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        !task.completed && (
                            <button
                                className="edit-btn"
                                onClick={() => {
                                    setEditTitle(task.title);
                                    setEditCategory(task.category || 'Other');
                                    setEditPriorityName(task.priority?.priorityName || task.priorityName || 'Medium');
                                    setIsEditing(true);
                                }}
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
        </div>
    );
};

