import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../App.css'; // Use the main App styles

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store login state and redirect
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ name: data.name, userId: data.userId }));
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--text-dark)' }}>Login</h2>
      {error && <p style={{ color: 'var(--danger)', textAlign: 'center', margin: 0 }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="email" style={{ color: 'var(--text-dark)', fontWeight: '500' }}>Email</label>
          <input
            className="task-input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="password" style={{ color: 'var(--text-dark)', fontWeight: '500' }}>Password</label>
          <input
            className="task-input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="add-btn" style={{ marginTop: '10px' }}>Login</button>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>Register here</Link>
        </p>
      </form>
    </div>
  );
};
