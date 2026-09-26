import { configureStore } from '@reduxjs/toolkit';
import themReducer from './feachers/them/themSlice';
import todosReducer from './feachers/todos/todosSlice';
import prioritiesReducer from './feachers/priorities/prioritiesSlice';

export const store = configureStore({
  reducer: {
    them: themReducer,
    todos: todosReducer,
    priorities: prioritiesReducer
  },
});