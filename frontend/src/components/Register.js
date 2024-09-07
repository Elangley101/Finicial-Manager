import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../util'; // Utility function for getting cookies

// Get the CSRF token from cookies
const csrftoken = getCookie('csrftoken');

// API URL (can be set via environment variables or fallback to localhost)
const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/users/register/';

const Register = () => {
    // State for form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');  // For displaying error messages
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous errors

        try {
            const response = await axios.post(
                apiURL,
                {
                    email,
                    password,
                    first_name: firstName,
                    last_name: lastName,
                },
                {
                    headers: {
                        'X-CSRFToken': csrftoken, // Send CSRF token in the request headers
                        'Content-Type': 'application/json',
                    },
                }
            );

            const token = response.data.access_token;
            if (token) {
                localStorage.setItem('token', token);  // Store JWT in localStorage
                navigate('/dashboard');  // Redirect to dashboard after successful registration
            }

        } catch (error) {
            // Handle error and display a meaningful message to the user
            if (error.response && error.response.data) {
                console.error("Error Response:", error.response.data);
                setErrorMessage(error.response.data.detail || 'An error occurred during registration.');
            } else {
                console.error("Unknown Error:", error);
                setErrorMessage('An unknown error occurred.');
            }
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
