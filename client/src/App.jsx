import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TodoApp } from './component/todo/TodoApp';
import { fetchTasks } from './store/feachers/todos/todosSlice';

export const App = () => {
  const { them } = useSelector((state) => state.them);
  const dispatch = useDispatch();

  // Load tasks on component mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Apply theme to the document globally based on Redux state
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', them);
  }, [them]);

  return (
    <>
      <TodoApp />
    </>
  );
};
