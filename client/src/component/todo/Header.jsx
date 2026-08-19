import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleThem } from '../../store/feachers/them/themSlice';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
    const { them } = useSelector((state) => state.them);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
    };

    return (
        <header className="header animate-slide-down">
            <h1>Task Master</h1>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    className="theme-btn"
                    onClick={() => dispatch(toggleThem())}
                    title={`Switch to ${them === 'light' ? 'Dark' : 'Light'} Mode`}
                >
                    {them === 'light' ? '🌙' : '☀️'}
                </button>
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                    title="Logout"
                    style={{
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '8px',
                        background: 'linear-gradient(90deg, #ff8a00, #e52e71)',
                        color: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    Logout
                </button>
            </div>
        </header>
    );
};
