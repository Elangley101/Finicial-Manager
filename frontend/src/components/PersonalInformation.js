import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';

const PersonalInformation = ({ userData }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            let response = await fetch('http://localhost:8000/api/users/profile/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify(formData),
            });
    
            if (response.status === 401) {
                // Access token might be expired, attempt to refresh the token
                const refreshResponse = await fetch('http://localhost:8000/api/token/refresh/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refresh: localStorage.getItem('refresh_token') }),
                });
    
                if (!refreshResponse.ok) {
                    throw new Error('Failed to refresh token');
                }
    
                const refreshData = await refreshResponse.json();
                localStorage.setItem('access_token', refreshData.access);
    
                // Retry the original request with the new access token
                response = await fetch('http://localhost:8000/api/users/profile/', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${refreshData.access}`,
                    },
                    body: JSON.stringify(formData),
                });
            }
    
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
    
            const data = await response.json();
            console.log('Profile updated:', data);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled // If you don't want the user to change their email
            />
            <Button type="submit" variant="contained" color="primary">
                Update Information
            </Button>
        </form>
    );
};

export default PersonalInformation;
