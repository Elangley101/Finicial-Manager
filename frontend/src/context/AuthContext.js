import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(atob(localStorage.getItem('authTokens').split('.')[1])) : null);

    const loginUser = async (email, password) => {
        const response = await axios.post('http://localhost:8000/api/users/login/', { email, password });
        if (response.status === 200) {
            setAuthTokens(response.data);
            setUser(JSON.parse(atob(response.data.access.split('.')[1])));
            localStorage.setItem('authTokens', JSON.stringify(response.data));
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    };

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
