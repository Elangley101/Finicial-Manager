import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, CircularProgress } from '@mui/material';

const PersonalInformation = () => {
    const [personalInfo, setPersonalInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user personal information
        axios.get('/api/user/personal-information/')
            .then((response) => {
                setPersonalInfo(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching personal information:', error);
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put('/api/user/personal-information/', personalInfo)
            .then((response) => {
                console.log('Personal information updated:', response.data);
            })
            .catch((error) => {
                console.error('Error updating personal information:', error);
            });
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                name="firstName"
                label="First Name"
                value={personalInfo.firstName}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="lastName"
                label="Last Name"
                value={personalInfo.lastName}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="email"
                label="Email"
                value={personalInfo.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="phone"
                label="Phone"
                value={personalInfo.phone}
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

export default PersonalInformation;
