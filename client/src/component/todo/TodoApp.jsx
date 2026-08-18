import React from 'react';
import { Header } from './Header';
import { TaskInput } from './TaskInput';
import { TaskFilter } from './TaskFilter';
import { TaskList } from './TaskList';

import '../../App.css';

export const TodoApp = () => {
    return (
        <div className="app-container">
            <Header />
            <TaskInput />
            <TaskFilter />
            <TaskList />
        </div>
    );
};
