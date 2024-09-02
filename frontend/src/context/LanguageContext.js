import React, { createContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        // Load saved language from local storage
        const savedLanguage = localStorage.getItem('language') || 'en';
        setLanguage(savedLanguage);
    }, []);

    useEffect(() => {
        // Save the selected language to local storage
        localStorage.setItem('language', language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
