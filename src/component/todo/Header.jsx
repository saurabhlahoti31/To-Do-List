import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleThem } from '../../store/feachers/them/themSlice';

export const Header = () => {
    const { them } = useSelector((state) => state.them);
    const dispatch = useDispatch();

    return (
        <header className="header animate-slide-down">
            <h1>Task Master</h1>
            <button
                className="theme-btn"
                onClick={() => dispatch(toggleThem())}
                title={`Switch to ${them === 'light' ? 'Dark' : 'Light'} Mode`}
            >
                {them === 'light' ? '🌙' : '☀️'}
            </button>
        </header>
    );
};
