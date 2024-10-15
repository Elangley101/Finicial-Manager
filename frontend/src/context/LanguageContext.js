import React, { createContext, useState, useEffect } from 'react';

// Create the LanguageContext
export const LanguageContext = createContext();

// Create the LanguageProvider component
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // Default language is English

    // Load the saved language from local storage when the component mounts
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'en';
        setLanguage(savedLanguage);
    }, []);

    // Save the selected language to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
