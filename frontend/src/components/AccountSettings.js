import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';

const AccountSettings = ({ userData }) => {
    const [settingsData, setSettingsData] = useState({
        notify_transactions: true,
        theme: 'light',
        language: 'en',
    });

    useEffect(() => {
        if (userData && userData.account_settings) {
            setSettingsData(userData.account_settings);
        }
    }, [userData]);

    const handleChange = (e) => {
        setSettingsData({
            ...settingsData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send the updated settings to the API
        fetch('/api/users/account-settings/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
            },
            body: JSON.stringify(settingsData),
        })
        .then(response => response.json())
        .then(data => {
            // Handle success (e.g., show a success message)
            console.log('Account settings updated:', data);
        })
        .catch(error => console.error('Error updating account settings:', error));
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Notify Transactions"
                name="notify_transactions"
                value={settingsData.notify_transactions}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Theme"
                name="theme"
                value={settingsData.theme}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Language"
                name="language"
                value={settingsData.language}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
                Update Settings
            </Button>
        </form>
    );
};

export default AccountSettings;
