import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleThem } from '../../store/feachers/them/themSlice';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const { them } = useSelector((state) => state.them);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getUserName = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            return user.name || 'User';
        } catch (e) {
            return 'User';
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="header animate-slide-down">
            <div>
                <h1 style={{ margin: 0 }}>Task Master</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '2px' }}>
                    Welcome back, <span style={{ fontWeight: '600', color: 'var(--accent-color)' }}>{getUserName()}</span> 👋
                </p>
            </div>
            <div className="header-actions">
                <button
                    className="theme-btn"
                    onClick={() => dispatch(toggleThem())}
                    title={`Switch to ${them === 'light' ? 'Dark' : 'Light'} Mode`}
                    aria-label="Toggle Theme"
                >
                    {them === 'light' ? '🌙' : '☀️'}
                </button>
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                    title="Logout"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

