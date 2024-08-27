import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, CircularProgress } from '@mui/material';

const AccountSettings = () => {
    const [accountSettings, setAccountSettings] = useState({
        username: '',
        emailNotifications: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user account settings
        axios.get('/api/user/account-settings/')
            .then((response) => {
                setAccountSettings(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching account settings:', error);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAccountSettings({
            ...accountSettings,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('/api/user/account-settings/', accountSettings)
            .then((response) => {
                console.log('Account settings updated:', response.data);
            })
            .catch((error) => {
                console.error('Error updating account settings:', error);
            });
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                name="username"
                label="Username"
                value={accountSettings.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="emailNotifications"
                label="Email Notifications"
                type="checkbox"
                checked={accountSettings.emailNotifications}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
                Save Changes
            </Button>
        </form>
    );
};

export default AccountSettings;
