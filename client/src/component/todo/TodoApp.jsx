import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Header } from './Header';
import { TaskInput } from './TaskInput';
import { TaskFilter } from './TaskFilter';
import { TaskList } from './TaskList';
import { fetchTasks } from '../../store/feachers/todos/todosSlice';

import '../../App.css';

export const TodoApp = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    return (
        <div className="app-container">
            <Header />
            <TaskInput />
            <TaskFilter />
            <TaskList />
        </div>
    );
};
