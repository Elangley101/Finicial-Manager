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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send the updated user data to the API
        fetch('/api/users/profile/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token for authentication
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            // Handle success (e.g., show a success message)
            console.log('Profile updated:', data);
        })
        .catch(error => console.error('Error updating profile:', error));
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
