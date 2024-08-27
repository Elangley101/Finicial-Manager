import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';

const PasswordReset = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            console.error('New passwords do not match');
            return;
        }

        axios.post('/api/user/password-reset/', {
            current_password: passwords.currentPassword,
            new_password: passwords.newPassword,
        })
            .then((response) => {
                console.log('Password reset successful:', response.data);
            })
            .catch((error) => {
                console.error('Error resetting password:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                name="currentPassword"
                label="Current Password"
                type="password"
                value={passwords.currentPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="newPassword"
                label="New Password"
                type="password"
                value={passwords.newPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                value={passwords.confirmPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
                Reset Password
            </Button>
        </form>
    );
};

export default PasswordReset;
