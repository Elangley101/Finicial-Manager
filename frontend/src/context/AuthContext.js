import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    
    const [authTokens, setAuthTokens] = useState(() => {
        const access = localStorage.getItem('access_token');
        const refresh = localStorage.getItem('refresh_token');
        return access && refresh ? { access, refresh } : null;
    });

    const loginUser = async (email, password) => {
        try {
            const response = await fetch('http://localhost:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (response.ok) {
                setAuthTokens(data);
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                navigate('/dashboard');
            } else {
                console.error('Login failed:', data.detail || data);
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    const refreshToken = async () => {
        if (!authTokens?.refresh) {
            logoutUser();
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: authTokens.refresh })
            });
            const data = await response.json();

            if (response.ok) {
                setAuthTokens(prev => ({ ...prev, access: data.access }));
                localStorage.setItem('access_token', data.access);
            } else {
                console.error('Failed to refresh token:', data.detail || data);
                logoutUser();
            }
        } catch (error) {
            console.error('An error occurred during token refresh:', error);
            logoutUser();
        }
    };

    useEffect(() => {
        if (authTokens) {
            const interval = setInterval(refreshToken, 15 * 60 * 1000); // Refresh every 15 minutes
            return () => clearInterval(interval);
        }
    }, [authTokens]);

    return (
        <AuthContext.Provider value={{ authTokens, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
