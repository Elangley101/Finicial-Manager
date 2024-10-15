import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Switch, FormControlLabel, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { ThemeContext } from '../context/ThemeProviderComponent';
import AuthContext from '../context/AuthContext';
import LanguageContext from '../context/LanguageContext';

const AccountSettings = ({ userData }) => {
    const { toggleTheme } = useContext(ThemeContext);
    const { setLanguage } = useContext(LanguageContext);
    const { authTokens } = useContext(AuthContext);
    const [settingsData, setSettingsData] = useState({
        notify_transactions: true,
        theme: 'light',
        language: 'en',
    });

    useEffect(() => {
        if (userData && userData.account_settings) {
            setSettingsData({
                notify_transactions: userData.account_settings.notify_transactions,
                theme: userData.account_settings.theme,
                language: userData.account_settings.language,
            });
            toggleTheme(userData.account_settings.theme);
            setLanguage(userData.account_settings.language);
        }
    }, [userData, toggleTheme, setLanguage]);

    const handleChange = (e) => {
        const { name, checked, value } = e.target;
        if (name === 'theme') {
            const newTheme = checked ? 'dark' : 'light';
            setSettingsData({
                ...settingsData,
                theme: newTheme,
            });
            toggleTheme(newTheme);
        } else if (name === 'language') {
            setSettingsData({
                ...settingsData,
                language: value,
            });
            setLanguage(value);
        } else {
            setSettingsData({
                ...settingsData,
                [name]: e.target.type === 'checkbox' ? checked : e.target.value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response = await fetch('http://localhost:8000/api/users/account-settings/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,
                },
                body: JSON.stringify(settingsData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    const refreshResponse = await fetch('http://localhost:8000/api/token/refresh/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ refresh: authTokens.refresh }),
                    });

                    if (!refreshResponse.ok) {
                        throw new Error('Failed to refresh token');
                    }

                    const refreshData = await refreshResponse.json();
                    localStorage.setItem('access_token', refreshData.access);

                    response = await fetch('http://localhost:8000/api/users/account-settings/', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${refreshData.access}`,
                        },
                        body: JSON.stringify(settingsData),
                    });
                } else {
                    throw new Error('Failed to update account settings');
                }
            }

            const data = await response.json();
            console.log('Account settings updated:', data);
        } catch (error) {
            console.error('Error updating account settings:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormControlLabel
                control={
                    <Switch
                        checked={settingsData.theme === 'dark'}
                        onChange={handleChange}
                        name="theme"
                    />
                }
                label="Dark Mode"
            />
            <FormControlLabel
                control={
                    <Switch
                        checked={settingsData.notify_transactions}
                        onChange={handleChange}
                        name="notify_transactions"
                    />
                }
                label="Notify Transactions"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Language</InputLabel>
                <Select
                    name="language"
                    value={settingsData.language}
                    onChange={handleChange}
                >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
                Update Settings
            </Button>
        </form>
    );
};

export default AccountSettings;
