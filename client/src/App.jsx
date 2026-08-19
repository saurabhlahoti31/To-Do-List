import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TodoApp } from './component/todo/TodoApp';
import { Login } from './component/auth/Login';
import { Register } from './component/auth/Register';
import { fetchTasks } from './store/feachers/todos/todosSlice';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

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
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <TodoApp />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
