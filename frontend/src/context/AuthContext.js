// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user data is in localStorage or other storage method
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const loginUser = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                email,
                password,
            });
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data)); // Persist user data
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
