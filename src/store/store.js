import { configureStore } from '@reduxjs/toolkit';
import themReducer from './feachers/them/themSlice';
import todosReducer from './feachers/todos/todosSlice';

export const store = configureStore({
  reducer: {
    them: themReducer,
    todos: todosReducer
  },
});