import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setThemeMode(savedTheme);
    }, []);

    const toggleTheme = (mode) => {
        const newTheme = mode === 'dark' ? 'dark' : 'light';
        setThemeMode(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const theme = createTheme({
        palette: {
            mode: themeMode,
        },
    });

    return (
        <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
