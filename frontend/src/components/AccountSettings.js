import React, { useContext, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const AccountSettings = ({ userData }) => {
    const { language, setLanguage } = useContext(LanguageContext);

    useEffect(() => {
        console.log('Language changed:', language);
    }, [language]);

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    if (!userData) {
        return <div>No user data available</div>;
    }

    const { email, first_name, last_name } = userData;

    return (
        <div>
            <h2>Account Settings</h2>
            <p>Email: {email}</p>
            <p>First Name: {first_name}</p>
            <p>Last Name: {last_name}</p>
            <div>
                <label>
                    Language:
                    <select value={language} onChange={handleLanguageChange}>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        {/* Add more languages as needed */}
                    </select>
                </label>
            </div>
            {/* Debug section to print userData */}
            <div style={{ marginTop: '16px', padding: '16px', border: '1px solid #ccc' }}>
                <h3>Debug: User Data</h3>
                <pre>{JSON.stringify(userData, null, 2)}</pre>
            </div>
        </div>
    );
};

export default AccountSettings;
