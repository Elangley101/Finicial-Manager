import React, { createContext, useState, useEffect } from 'react';

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('USD');

    useEffect(() => {
        const savedCurrency = localStorage.getItem('currency') || 'USD';
        setCurrency(savedCurrency);
    }, []);

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
};
