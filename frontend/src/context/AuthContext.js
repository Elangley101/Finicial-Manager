// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
        const data = response.data;
        // Store the JWT token in local storage or use it as needed
        localStorage.setItem('token', data.access);
        return true;
    } catch (error) {
        console.error('Login failed', error);
        return false;
    }
};


  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
