import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography } from '@mui/material';

const PasswordReset = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
        setError(''); // Clear error when user starts typing
        setSuccess(''); // Clear success message when user starts typing
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        axios.post('http://localhost:8000/api/users/password-reset/', { // Updated URL with port 8000
            current_password: passwords.currentPassword,
            new_password: passwords.newPassword,
        })
            .then((response) => {
                setSuccess('Password reset successful');
                setPasswords({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            })
            .catch((error) => {
                setError('Error resetting password: ' + (error.response ? error.response.data.error : error.message));
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>Reset Password</Typography>
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="primary">{success}</Typography>}
            <TextField
                name="currentPassword"
                label="Current Password"
                type="password"
                value={passwords.currentPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                name="newPassword"
                label="New Password"
                type="password"
                value={passwords.newPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                value={passwords.confirmPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <Button type="submit" variant="contained" color="primary">
                Reset Password
            </Button>
        </form>
    );
};

export default PasswordReset;
