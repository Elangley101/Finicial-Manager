import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiURL = process.env.REACT_APP_API_URL || 'http://backend:8000/api/users/register/';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(apiURL, { // Use the apiURL variable here
                email,
                password,
                first_name: firstName,
                last_name: lastName
            });
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Register</h1>
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
