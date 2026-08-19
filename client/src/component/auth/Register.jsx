import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../App.css'; // Use the main App styles

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      // Store login state and redirect
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ name, userId: data.userId }));
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-container" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--text-dark)' }}>Create Account</h2>
      {error && <p style={{ color: 'var(--danger)', textAlign: 'center', margin: 0 }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="name" style={{ color: 'var(--text-dark)', fontWeight: '500' }}>Name</label>
          <input
            className="task-input"
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </div>
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
            placeholder="Create a password"
          />
        </div>
        <button type="submit" className="add-btn" style={{ marginTop: '10px' }}>Register</button>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link>
        </p>
      </form>
    </div>
  );
};
