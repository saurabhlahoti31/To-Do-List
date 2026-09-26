import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Header } from './Header';
import { PriorityDashboard } from './PriorityDashboard';
import { TaskInput } from './TaskInput';
import { TaskFilter } from './TaskFilter';
import { TaskList } from './TaskList';
import { fetchTasks } from '../../store/feachers/todos/todosSlice';
import { fetchPriorities } from '../../store/feachers/priorities/prioritiesSlice';

import '../../App.css';

export const TodoApp = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPriorities());
        dispatch(fetchTasks());
    }, [dispatch]);

    return (
        <div className="app-container">
            <Header />
            <PriorityDashboard />
            <TaskInput />
            <TaskFilter />
            <TaskList />
        </div>
    );
};

